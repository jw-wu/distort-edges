/* Engine */
import * as util from "../../custom/scripts/engine/settings/utility";
import { DistortEdgesRecipe } from "../../custom/scripts/engine/distortion/recipe";

/* Plugins */
import { VectorNodeModel, VectorPathCommand } from "./vectornode-model";
import * as vectorManipulation from "../general/vector";
import * as random from "../general/random";



/*  DISTORTED NODE BLUEPRINT
    Parses SVG draw commands into a model with each command and their coords organised
    into an array. The extended class used for Distort Edges adds support for segmenting paths,
    and storage for subpoints so that new distortions with the same recipe do not require new calculations.

    Adds support for a subpoint library so that subpoints do not need to be calculated every time,
    should the library be used to generate animations.
    
    Structure
    Array lvl 1: An array containing all subpoints.
    Array lvl 2: Each shape / form is contained in an array.
    Array lvl 3: Each draw command / path section is contained in its own array.
    DistortSubpoint: Each subpoint is stored as a DistortSubpoint type.

    If the last subpoint coords are not the same as the first's then the last command is not a Z.
*/
export class DistortedNodeModel extends VectorNodeModel {

  protected pathSegments: DistortedNodePathSegment[];
  protected perimeter: number;
  readonly settings: ExtendedVectorNodeModelSettings;


  constructor(d: string, settings: ExtendedVectorNodeModelSettings) {

    super(d);
    
    this.pathSegments = [ ];
    this.perimeter = 0;
    this.settings = settings;

    for (let vectorCommand of this.commands) {

      const pathSegment = this._getPathSegment(vectorCommand, settings);
      if (pathSegment)
        this.pathSegments.push(pathSegment);

      this._generateSubpoints(vectorCommand, this.getLastPathSegment());
      this.perimeter += this.getLastPathSegment().pathLength;

    }

  }


  private _getPathSegment(vectorCommand: VectorPathCommand, settings: ExtendedVectorNodeModelSettings): DistortedNodePathSegment | null {

    // One segment for each command including M and Z, to tally with this.commands.
    if (vectorCommand.type === "M" || vectorCommand.type === "Z") {

      return { pathLength: 0, subSegments: 0, increments: [ ], subpoints: [ ] };

    }

    else if (vectorCommand.type === "L" || vectorCommand.type === "Q" || vectorCommand.type === "C") {

      let startingPoint = this.getPreviousCommand(vectorCommand);

      let pathSegment: DistortedNodePathSegment = { pathLength: 0, subSegments: 0, increments: [ ], subpoints: [ ] };

      if (startingPoint) {

        // If the starting point is a Z, use the M details. Happens within Figma.
        if (startingPoint.type === "Z")
          startingPoint = this.getFirstCommandOnPath(startingPoint);
    
        // Get the total length of the path.
        if (vectorCommand.type === "L")
          pathSegment.pathLength = vectorManipulation.getLinePathLength(startingPoint.coords, vectorCommand.coords);

        else if (vectorCommand.type === "Q")
          pathSegment.pathLength = vectorManipulation.getQuadraticPathLength(startingPoint.coords, vectorCommand.handles[0], vectorCommand.coords);

        else if (vectorCommand.type === "C")
          pathSegment.pathLength = vectorManipulation.getCubicPathLength(startingPoint.coords, vectorCommand.handles[0], vectorCommand.handles[1], vectorCommand.coords);


        // Get variable distances.
        if (settings.variableDistanceApart) {

          const distances = this._getVariableDistances(
            pathSegment.pathLength,
            settings.minDistanceApart ?? 0,
            settings.maxDistanceApart ?? 0
          );
          pathSegment.subSegments = distances.length;
          pathSegment.increments = [ ...distances ];
        }

        else {

          const distanceApart = (settings.distanceApart === 0 || !settings.distanceApart) ?
            0.1 * pathSegment.pathLength :  // Defaults to 10% of path length.
            settings.distanceApart;

          const distances = this._getUniformDistances(
            vectorCommand,
            pathSegment.pathLength,
            distanceApart,
            settings.keepWithinOriginalSize
          );
          pathSegment.subSegments = distances.length;
          pathSegment.increments = [ ...distances ];

        }

        return pathSegment;

      }

      else
        console.error("Previous command could not be retreived as Vector Command could not be found.");

    }

    return null;

  }


  private _generateSubpoints(vectorCommand: VectorPathCommand, pathSegment: DistortedNodePathSegment): void {

    // Create an entry for M, but fill it up when Z is being processed.
    // If there are no Zs, slope and segmentDistance will be left as 0.
    let mIndex = 0;

    if (vectorCommand.type === "M") {

      mIndex = this.getCommandIndex(vectorCommand);

      this.getPathSegmentByCommand(vectorCommand).subpoints.push({
        coords: vectorCommand.coords,
        slope: 0,
        segmentDistance: 0
      });

    }


    // L, Q, C. Loop though each increment to calculate subpoint coords and slope.
    // Calculate the last segment slope at the next draw command.
    else if (vectorCommand.type !== "Z") {

      // Get coords of current, previous and next subpoints.
      let currentSubpointCoords = vectorManipulation.getPointOnPath(vectorCommand.origin, vectorCommand.coords, vectorCommand.handles, pathSegment.increments[0]);

      if (currentSubpointCoords === null) {

        console.error("Current subpoint coords in the Extended Vector Node Model cannot be determined.");
        return;
        
      }

      else {

        let previousSubpointCoords = vectorCommand.origin,
            accumulatedPosition = pathSegment.increments[0],
            nextSubpointCoords = { x: NaN, y: NaN };

        // Start segmentation.
        for (let s = 0; s < pathSegment.subSegments; ++s) {
          
          const segmentDistance = pathSegment.increments[s] * pathSegment.pathLength;         
          
          // Calculate slope for the previous subpoint if previous subpoint is not M or Z.
          const previousCommand = this.getPreviousCommand(vectorCommand);
          if (s === 0 && previousCommand && previousCommand.type !== "M" && previousCommand.type !== "Z") {

            const previousPathSegment = this.getPathSegmentByCommand(previousCommand);
            let previousSubpoint = previousPathSegment.subpoints[previousPathSegment.subpoints.length - 1];

            const slopeStart = vectorManipulation.getPointOnPath(
              previousCommand.origin,
              previousCommand.coords,
              previousCommand.handles,
              1 - previousPathSegment.increments[previousPathSegment.increments.length - 1]
            );

            const slopeEnd = currentSubpointCoords;
            
            if (slopeStart)
              previousSubpoint.slope = vectorManipulation.getAbsoluteAngle(slopeStart, slopeEnd);

            else
              console.error("Starting point of slope cannot be determined.");

          }


          // Not last segment.
          if (s !== pathSegment.subSegments - 1) {

            accumulatedPosition += pathSegment.increments[s + 1];
            nextSubpointCoords = vectorManipulation.getPointOnPath(vectorCommand.origin, vectorCommand.coords, vectorCommand.handles, accumulatedPosition)!;

            this.getPathSegmentByCommand(vectorCommand).subpoints.push({
              coords: currentSubpointCoords,
              slope: vectorManipulation.getAbsoluteAngle(previousSubpointCoords, nextSubpointCoords),
              segmentDistance: segmentDistance
            });

          }

          // Last segment.
          else {

            this.getPathSegmentByCommand(vectorCommand).subpoints.push({
              coords: currentSubpointCoords,
              slope: 0,
              segmentDistance: segmentDistance
            });

          }

          previousSubpointCoords = currentSubpointCoords;
          currentSubpointCoords = nextSubpointCoords;

        }
      
      }

    }


    // Creates an entry for Z, calculate slope angle for related M, as well as the slope for last drawing command.
    else {

      // Creates an empty entry so that the sequence matches this.commands.
      this.getPathSegmentByCommand(vectorCommand).subpoints.push({
        coords: { x: NaN, y: NaN },
        slope: 0,
        segmentDistance: 0
      });


      // Calculates slopes.
      const previousCommand = this.getPreviousCommand(vectorCommand);

      if (previousCommand) {

        const previousPathSegment = this.getPathSegmentByCommand(previousCommand),
              previousPosition = 1 - previousPathSegment.increments[previousPathSegment.increments.length - 1];

        let previousSubpoint = previousPathSegment.subpoints[previousPathSegment.subpoints.length - 1];

        const nextCommand = this.getCommand(mIndex + 1),
              nextPathSegment = this.getPathSegmentByCommand(nextCommand);

        const slopeStart = vectorManipulation.getPointOnPath(previousCommand.origin, previousCommand.coords, previousCommand.handles, previousPosition)!,
              slopeEnd = vectorManipulation.getPointOnPath(nextCommand.origin, nextCommand.coords, nextCommand.handles, nextPathSegment.increments[0])!;

        const slope = vectorManipulation.getAbsoluteAngle(slopeStart, slopeEnd);
        

        // Slope for the most recent subpoint.
        previousSubpoint.slope = slope;


        // Slope for M.
        this.getPathSegmentByCommand(this.getCommand(mIndex)).subpoints[0].slope = slope;

      }

    }

  }


  private _getUniformDistances(vectorCommand: VectorPathCommand, pathLength: number, distanceApart: number, keepWithinOriginalSize: boolean): number[] {

    let results = [ ];

    if (pathLength <= distanceApart)
      results.push(1);

    // Double the offset for the first and last subpoints so that corners remain visible in a rectangle.
    else if (keepWithinOriginalSize && vectorCommand.type === "L") {

      const endsDistances = (distanceApart * 2) / pathLength,
            middlePortion = pathLength - (distanceApart * 4);

      results.push(endsDistances);

      const segments = Math.round(middlePortion / distanceApart),
            distance = (middlePortion / segments) / pathLength;

      for (let d = 0; d < segments; ++d) {

        results.push(distance);

      }

      results.push(endsDistances);

    }

    else {

      const segments = Math.round(pathLength / distanceApart),
            distance = (pathLength / segments) / pathLength;

      for (let d = 0; d < segments; ++d) {

        results.push(distance);

      }
    }

    return results;

  }


  private _getVariableDistances(pathLength: number, minDistanceApart: number, maxDistanceApart: number): number[] {

    let variableDistanceProportions: number[] = [ ],
        distanceLeft = pathLength;


    // Default minimum distance apart 0.2, maximum distance apart 0.5.
    const minDistanceApartPercentage = (minDistanceApart === 0) ? 0.2 : minDistanceApart / pathLength,
          maxDistanceApartPercentage = (maxDistanceApart === 0) ? 0.5 : maxDistanceApart / pathLength;
          
    const minimumDistance = minDistanceApartPercentage * pathLength;

    
    while (distanceLeft > 0) {

      let randomDistancePercentage = random.randomNumberWithinRange(minDistanceApartPercentage, maxDistanceApartPercentage) / 2,
          newDistance = util.roundOff(randomDistancePercentage * pathLength);
          

      if (distanceLeft <= minimumDistance) {

        if (variableDistanceProportions.length === 0)
          variableDistanceProportions.push(1);

        else
          variableDistanceProportions[variableDistanceProportions.length - 1] += util.roundOff(distanceLeft / pathLength);

        break;

      }

      else if (newDistance > distanceLeft)
        newDistance = distanceLeft;
  

      variableDistanceProportions.push(newDistance / pathLength);
      distanceLeft -= newDistance;

    }


    // If distance is 0, return an array with only the "full" length.
    if (variableDistanceProportions.length === 0)
      variableDistanceProportions.push(1);

    
    return variableDistanceProportions;

  }


  // Gets the last path segment.
  getLastPathSegment(): DistortedNodePathSegment {

    return this.pathSegments[this.pathSegments.length - 1];
    
  }


  // Gets the path segment by VectorPathCommand.
  getPathSegmentByCommand(vectorCommand: VectorPathCommand): DistortedNodePathSegment {

    return this.pathSegments[this.getCommandIndex(vectorCommand)];

  }


  getPerimeter(): number {
    return this.perimeter;
  }

}


interface DistortedNodePathSegment {
  pathLength: number;
  subSegments: number;
  increments: number[];
  subpoints:  { coords: { x: number;
                          y: number;
                        },
                slope: number;
                segmentDistance: number;
  }[];
}


export interface ExtendedVectorNodeModelSettings {
  variableDistanceApart: boolean;   // Should the sub-segment points be a regular distance from each other?
  distanceApart?: number;           // Distance between each sub-segment point.
  minDistanceApart?: number;        // Minimum distance between each point.
  maxDistanceApart?: number;        // Maximum distance between each point.
  keepWithinOriginalSize: boolean;  // Should the shape extend beyond its original boundaries. Needed for corners. (See if it can be moved to recipe)
}


export const isExtendedVectorNodeModelSettings = (input: any): input is DistortEdgesRecipe => (
  "variableDistanceApart" in input &&
  "keepWithinOriginalSize" in input &&
  (
    ("minDistanceApart" in input && "maxDistanceApart" in input) ||
    "distanceApart" in input
  )
);


export function logSettingsErrors(settings: any) {

  if (typeof settings.variableDistanceApart === "undefined")
    console.error("Parameter \"variableDistanceApart\" missing.");

  else if (typeof settings.variableDistanceApart !== "boolean")
    console.error("Parameter \"variableDistanceApart\" needs to be a boolean.");

  if (!settings.variableDistanceApart && !settings.distanceApart)
    console.error("Parameter \"distanceApart\" missing.");

  else if (!settings.variableDistanceApart && typeof settings.distanceApart !== "number")
    console.error("Parameter \"distanceApart\" needs to be a number.");


  if (typeof settings.keepWithinOriginalSize === "undefined")
    console.error("Parameter \"keepWithinOriginalSize\" missing.");

  else if (typeof settings.keepWithinOriginalSize !== "boolean")
    console.error("Parameter \"keepWithinOriginalSize\" needs to be a boolean.");

}



// Move out?

export class DistortedNodeCenter {

  protected x: number;
  protected y: number;

  // Cardinal points at the node's extremes.
  protected n: number;
  protected s: number;
  protected e: number;
  protected w: number;


  constructor(width: number, height: number) {
    this.x = width / 2;
    this.y = height / 2;
    this.n = this.y;
    this.s = this.y;
    this.e = this.x;
    this.w = this.x;
  }


  // Discerns if the coord should be used for the properties of the DistortedNodeCenter.
  discern(vector: Vector): void {

    if (vector.x > this.e)
      this.e = vector.x;
    
    else if (vector.x < this.w)
      this.w = vector.x;

    if (vector.y > this.s)
      this.s = vector.y;

    else if (vector.y < this.n)
      this.n = vector.y;

  }


  // Get the coords of the center.
  getCoords(): Vector {

    return { x: this.x - this.w, y: this.y - this.n };

  }

}


export interface PreviousSubpoint {
  coords: Vector;
  handleAngle: number;
}