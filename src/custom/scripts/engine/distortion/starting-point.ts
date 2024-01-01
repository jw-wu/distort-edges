/* Engine */
import { VectorPathCommand } from "../../../../plugins/figma/vectornode-model";
import { DistortEdgesRecipe } from "./recipe";
import * as util from "../settings/utility";

/* Plugins */
import { DistortedNodeModel, PreviousSubpoint } from "../../../../plugins/figma/vectornode-model-extended";
import * as vectorPlugin from "../../../../plugins/general/vector";



export function create(model: DistortedNodeModel, vectorCommand: VectorPathCommand, recipe: DistortEdgesRecipe): { path: string, previousSubpoint: PreviousSubpoint } | null {

  util.debugLog("Starting distortedges-startingpoint.create()", util.consoleColor.inProgress);

  // Gets previous vector command that is not Z, and the next command.  
  const previousVectorCommand = model.getLastCommandOnPath(vectorCommand, false),
        nextVectorCommand = model.getNextCommand(vectorCommand);


  if (nextVectorCommand) {

    // Gets previous subpoint based on the distanceApart. If distanceApart is variable, get the subpoint based on the increment.
    const previousPathSegment = model.getPathSegmentByCommand(previousVectorCommand),
          previousSubpointDistanceFromM = (model.settings.distanceApart) ?
            model.settings.distanceApart :
            previousPathSegment.increments[previousPathSegment.increments.length - 1] * previousPathSegment.pathLength;
            
    const previousSubpoint = vectorPlugin.getPointOnPath(
            previousVectorCommand.origin,
            previousVectorCommand.coords,
            previousVectorCommand.handles,
            util.roundOff((previousPathSegment.pathLength - previousSubpointDistanceFromM) / previousPathSegment.pathLength)
          );


    // Gets next subpoint based on the distanceApart. If distanceApart is variable, get the subpoint based on the increment.
    const nextPathSegment = model.getPathSegmentByCommand(nextVectorCommand),
          nextSubpointDistanceFromM = (model.settings.distanceApart) ?
            model.settings.distanceApart :
            nextPathSegment.increments[0] * previousPathSegment.pathLength;

    const nextSubpoint = vectorPlugin.getPointOnPath(
            nextVectorCommand.origin,
            nextVectorCommand.coords,
            nextVectorCommand.handles,
            util.roundOff(nextSubpointDistanceFromM / nextPathSegment.pathLength)
          );


    if (previousSubpoint && nextSubpoint) {

      // Sets up a storage for relaying subpoints to the next function.
      let subpoint = {
        coords: { x: NaN, y: NaN },
        handleAngle: NaN
      };


      // Determines the offset needed for the starting point.
      let startOffset = 0;

      if (!model.settings.keepWithinOriginalSize) {

        if (recipe.variableDistortionDistance)
          startOffset = Math.random() * recipe.maximumDistortionDistance;
  
        else
          startOffset = recipe.maximumDistortionDistance;

      }


      // Determines the coords of the starting point after edge distortion. The point may not be the exact midpoint of the slope.
      let distortionStartingPoint: Vector;

      if (startOffset === 0)
        distortionStartingPoint = vectorCommand.origin;

      else {

        const slope = vectorPlugin.getAbsoluteAngle(previousSubpoint, nextSubpoint),
              winding = (vectorCommand.winding === "clockwise") ? "counter-clockwise" : "clockwise",
              perpendicularAngle = vectorPlugin.getPerpendicularAngle(slope, winding),
              relativeDistance = vectorPlugin.getCoordsFromAbsoluteAngle(perpendicularAngle, startOffset);

        distortionStartingPoint = { x: vectorCommand.origin.x + relativeDistance.x, y: vectorCommand.origin.y + relativeDistance.y };

      }

      
      let output = `M ${distortionStartingPoint.x} ${distortionStartingPoint.y}`;


      // Calculates the handle for the next point.
      const handleSlope = vectorPlugin.getAbsoluteAngle(previousSubpoint, nextSubpoint);

      let startingPathSegment = model.getPathSegmentByCommand(vectorCommand);
      startingPathSegment.subpoints = [ { coords: distortionStartingPoint, slope: handleSlope, segmentDistance: 0 } ];


      // Stores the coords and handle of the ending point in the model.
      const endingPoint = model.getLastCommandOnPath(vectorCommand);

      let endingPathSegment = model.getPathSegmentByCommand(endingPoint);
      endingPathSegment.subpoints = [ { coords: distortionStartingPoint, slope: -handleSlope, segmentDistance: 0 } ];


      // Stores the coords and the slope in the variable to pass out of the function. This is for the edges calculation.
      subpoint.coords = distortionStartingPoint;
      subpoint.handleAngle = handleSlope;


      util.debugLog(`Completed distortedges-startingpoint.create(). Result type: ${typeof output}`, util.consoleColor.success);

      return { path: output, previousSubpoint: subpoint };

    }

  }

  util.debugLog(`Completed distortedges-startingpoint.create(). Result type: null`, util.consoleColor.error);

  return null;

}