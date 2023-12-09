/* Engine */
import { VectorPathCommand } from "../../../plugins/figma/vectornode-model";
import { DistortedNodeModel, DistortedNodeCenter, PreviousSubpoint } from "../../../plugins/figma/vectornode-model-extended";
import { DistortEdgesRecipe } from "./distortion-recipe";
import * as util from "./utility";

/* Plugins */
import * as vectorPlugin from "../../../plugins/general/vector";



// Types.
interface DistortionResults {
  half: {
    offset: number;
    rotation: "clockwise" | "counter-clockwise",
    coords: Vector,
    slope1: number,
    slope2: number,
    handleDistance1: Vector,
    handleDistance2: Vector,
    handle1: Vector,
    handle2: Vector
  },
  full: {
    offset: number;
    rotation: "clockwise" | "counter-clockwise",
    coords: Vector,
    slope1: number,
    slope2: number,
    handleDistance1: Vector,
    handleDistance2: Vector,
    handle1: Vector,
    handle2: Vector
  }
};



// <----------- Path segment ---------->
// <- Sub-seg ->
// Point       Subpoint    Subpoint    Point       Subpoint    Subpoint    Point
// ▆           ▖           ▖           ▆           ▖           ▖           ▆

export function distort(model: DistortedNodeModel, vectorCommand: VectorPathCommand, recipe: DistortEdgesRecipe, center: DistortedNodeCenter, previousSubpoint: PreviousSubpoint): { path: string, previousSubpoint: PreviousSubpoint } {

  util.debugLog("Starting distortedges-uniformdistance.create()", util.consoleColor.inProgress);

  let output = "";


  // Sets up starting point for multiple uses.
  let pathSegment = model.getPathSegmentByCommand(vectorCommand);


  // Sets up new point storage.
  let result: DistortionResults = {
    half: {
      offset: NaN,
      rotation: "counter-clockwise",
      coords: { x: NaN, y: NaN },
      slope1: NaN,
      slope2: NaN,
      handleDistance1: { x: NaN, y: NaN },
      handleDistance2: { x: NaN, y: NaN },
      handle1: { x: NaN, y: NaN },
      handle2: { x: NaN, y: NaN }
    },
    full: {
      offset: NaN,
      rotation: "counter-clockwise",
      coords: { x: NaN, y: NaN },
      slope1: NaN,
      slope2: NaN,
      handleDistance1: { x: NaN, y: NaN },
      handleDistance2: { x: NaN, y: NaN },
      handle1: { x: NaN, y: NaN },
      handle2: { x: NaN, y: NaN }
    }
  };


  // Checks if the path is going in a clockwise or counter-clockwise direction. This will affect the rotation of the half and full points.
  const rotationInwards = (vectorCommand.winding === "clockwise") ? "clockwise" : "counter-clockwise",
        rotationOutwards = (vectorCommand.winding === "clockwise") ? "counter-clockwise" : "clockwise";


  // Gets necessary data for the calculations.
  const previousCommand = model.getPreviousCommand(vectorCommand),
        nextCommand = model.getNextCommand(vectorCommand);


  // Loops through each segment to get new coords and handles.
  const lastIndex = pathSegment.subSegments - 1;
  for (let n = 0; n < pathSegment.subSegments; ++n) {

    // Sets up checks for the calculations.
    const hasRoundedPoints = (recipe.handleDistancePeak === 0 && recipe.handleDistanceTrough === 0) ? false : true,
          isLastSubpoint = (nextCommand?.type === "Z" && n === lastIndex) ? true : false;


    // Offset distance from horizon.
    if (recipe.variableDistortionDistance) {

      if (model.settings.keepWithinOriginalSize) {

        result.half.offset = Math.random() * (recipe.maximumDistortionDistance * 2);
        result.full.offset = Math.random() * (recipe.maximumDistortionDistance * 2);

        result.half.rotation = rotationInwards;
        result.full.rotation = rotationInwards;

      }

      else {

        result.half.offset = Math.random() * recipe.maximumDistortionDistance;
        result.full.offset = Math.random() * recipe.maximumDistortionDistance;

        let rotationDiceRoll = Math.ceil(Math.random() * 2);
        result.half.rotation = (rotationDiceRoll === 1) ? rotationInwards : rotationOutwards;
        rotationDiceRoll = Math.ceil(Math.random() * 2);
        result.half.rotation = (rotationDiceRoll === 1) ? rotationInwards : rotationOutwards

      }

    }

    else {

      if (model.settings.keepWithinOriginalSize) {

        result.half.offset = recipe.maximumDistortionDistance;
        result.full.offset = 0;

      }

      else {

        result.half.offset = 0; // Points stick out from the original shape.
        result.full.offset = recipe.maximumDistortionDistance;
  
      }

      // If uniform distance is selected, each subpoint distance is equal to the full distanceApart, so the half point is always below (because start is above).
      result.half.rotation = rotationInwards;
      result.full.rotation = rotationOutwards;

    }


    // Calculates coords of the subpoints.
    const subpoint = pathSegment.subpoints[n],
          previousSubpointCoords = (n === 0) ?
            vectorCommand.origin :
            pathSegment.subpoints[n - 1].coords;


    // Half point.
    const midpoint = vectorPlugin.getPointOnLine(previousSubpointCoords, subpoint.coords, 0.5);
    
    let subpointAngle = vectorPlugin.getAbsoluteAngle(previousSubpointCoords, subpoint.coords);

    // If the command is an L, shift the angle used to generate the subpoint half coords by a little,
    // so that the corner will remain a "spike" instead of being hairline thin.
    if (vectorCommand.type === "L") {
    
      // If subpoint is the first, slightly turn the angle counter-clockwise.
      if (n === 0)
        subpointAngle += 22.5;

      // Do the same for the last subpoint, in the other direction.
      else if (n === lastIndex)
        subpointAngle -=22.5;

    }

    result.half.coords = vectorPlugin.getPointPerpendicularToAngle(subpointAngle, midpoint, result.half.offset, result.half.rotation);


    // Full point.
    if (model.settings.keepWithinOriginalSize)
      result.full.coords = subpoint.coords;

    // If next command is a Z, set the coord according to the already calculated one.
    else if (isLastSubpoint) {

      const mVectorCommand = model.getFirstCommandOnPath(vectorCommand),
            mPathSegment = model.getPathSegmentByCommand(mVectorCommand);
      result.full.coords = mPathSegment.subpoints[0].coords;

    }

    else
      result.full.coords = vectorPlugin.getPointPerpendicularToAngle(subpoint.slope, subpoint.coords, result.full.offset, result.full.rotation);


    // Calculates handles of the subpoint.
    if (hasRoundedPoints) {

      // Calculate slopes for the half point. Retrieve slope from M if command is the first drawing command.
      if (previousCommand && n === 0) {

        const previousPathSegment = model.getPathSegmentByCommand(previousCommand),
              lastSubpointIndex = previousPathSegment.subpoints.length - 1;
        result.half.slope1 = previousPathSegment.subpoints[lastSubpointIndex].slope;

      }

      else
        result.half.slope1 = previousSubpoint.handleAngle;

      result.half.slope2 = vectorPlugin.getAbsoluteAngle(previousSubpointCoords, subpoint.coords);


      // Calculate slopes for the full point.
      result.full.slope1 = result.half.slope2;
      result.full.slope2 = subpoint.slope;


      // Get handle distances.
      const handleDistanceMultiplierPeak = recipe.handleDistancePeak ?? 0.25;
      const handleDistanceMultiplierTrough = recipe.handleDistanceTrough ?? 0.25;

      const handleDistance = subpoint.segmentDistance * 0.5,
            originCoords = previousSubpoint.coords;


      result.half.handleDistance1 = vectorPlugin.getCoordsFromAbsoluteAngle(result.half.slope1, handleDistance * handleDistanceMultiplierPeak);
      result.half.handle1 = vectorPlugin.getHandleCoords(originCoords, result.half.handleDistance1, "after");

      result.half.handleDistance2 = vectorPlugin.getCoordsFromAbsoluteAngle(result.half.slope2, handleDistance * handleDistanceMultiplierTrough);
      result.half.handle2 = vectorPlugin.getHandleCoords(result.half.coords, result.half.handleDistance2, "before");

      result.full.handleDistance1 = vectorPlugin.getCoordsFromAbsoluteAngle(result.full.slope1, handleDistance * handleDistanceMultiplierTrough);
      result.full.handle1 = vectorPlugin.getHandleCoords(result.half.coords, result.full.handleDistance1, "after");

      result.full.handleDistance2 = vectorPlugin.getCoordsFromAbsoluteAngle(result.full.slope2, handleDistance * handleDistanceMultiplierPeak);
      result.full.handle2 = vectorPlugin.getHandleCoords(result.full.coords, result.full.handleDistance2, "before");

    }


    // Get center of distorted node.
    center.discern(result.half.coords);
    center.discern(result.full.coords);
    

    // Saves current point properties for the next calculation.
    previousSubpoint.coords = result.full.coords;

    if (hasRoundedPoints)
      previousSubpoint.handleAngle = result.full.slope2;


    // Add points to command string.
    if (hasRoundedPoints) {

      output =  [ output,
                  "C",
                  util.roundOff(result.half.handle1.x), util.roundOff(result.half.handle1.y),
                  util.roundOff(result.half.handle2.x), util.roundOff(result.half.handle2.y),
                  util.roundOff(result.half.coords.x), util.roundOff(result.half.coords.y),
                  "C",
                  util.roundOff(result.full.handle1.x), util.roundOff(result.full.handle1.y),
                  util.roundOff(result.full.handle2.x), util.roundOff(result.full.handle2.y),
                  util.roundOff(result.full.coords.x), util.roundOff(result.full.coords.y)
                ].join(" ");

    }

    else {

      output =  [ output,
                  "L",
                  util.roundOff(result.half.coords.x), util.roundOff(result.half.coords.y),
                  "L",
                  util.roundOff(result.full.coords.x), util.roundOff(result.full.coords.y)
                  ].join(" ");

    }

  }


  util.debugLog(`Completed distortedges-variabledistance.distort(). Result type: ${typeof output}`, util.consoleColor.success);

  return { path: output.trim(), previousSubpoint: previousSubpoint };

}