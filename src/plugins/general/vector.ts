/* Plugins */
import * as trigonometry from "./trigonometry";


// All results are rounded off to 3 decimal places to reduce issues with exponentials.
const decPlaces = 3;

function roundOff(number: number) {

  return Math.round(number * Math.pow(10, decPlaces)) / Math.pow(10, decPlaces);
  
}


// Flips the handle coords with the point coords set as origin
export function flipHandle(handle: Vector, origin: Vector) {

  return { x: origin.x + (origin.x - handle.x), y: origin.y + (origin.y - handle.y) };
  
}


// Returns the coords of a handle point relative to the orgin coord.
export function getHandleCoords(origin: Vector, relativeDistance: Vector, position: "before" | "after"): Vector {

  if (position === "before")
    return { x: origin.x - relativeDistance.x, y: origin.y - relativeDistance.y };

  else
    return { x: origin.x + relativeDistance.x, y: origin.y + relativeDistance.y };

}



// To get a more accurate reading, we will need to have a html interface to run getTotalLength(). But this is good enough for Figma.
export function getLinePathLength(start: Vector, end: Vector): number {

  const adjacentSide = Math.abs(start.x - end.x),
        oppositeSide =  Math.abs(start.y - end.y),
        linePathLength = trigonometry.getHypotenuse({ adjacentSide: adjacentSide, oppositeSide: oppositeSide });

  return (linePathLength != null) ? roundOff(linePathLength) : NaN;

}


export function getQuadraticPathLength(start: Vector, handle: Vector, end: Vector): number {

  // Split a curve into smaller "linear" segments to calculate approx length.
  let segments = 30,
      totalLength = 0;

  for (let segment = 1; segment < segments; ++segment) {

    const calculationStart = getPointOnQuadraticCurve(start, handle, end, segment / segments),
          calculationEnd = getPointOnQuadraticCurve(start, handle, end, (segment + 1) / segments),
          adjacentSide = Math.abs(calculationStart.x - calculationEnd.x),
          oppositeSide =  Math.abs(calculationStart.y - calculationEnd.y),
          segmentLength = trigonometry.getHypotenuse({ adjacentSide: adjacentSide, oppositeSide: oppositeSide });

    if (typeof segmentLength === "number")
      totalLength += roundOff(segmentLength);

    else {

      console.error("Calculated segment length for quadratic path length returned as null.");
      break;

    }

  }

  return roundOff(totalLength);
  
}


export function getCubicPathLength(start: Vector, handle1: Vector, handle2: Vector, end: Vector): number {

  // Split a curve into smaller "linear" segments to calculate approx length.
  let segments = 30,
      totalLength = 0;

  for (let segment = 1; segment < segments; ++segment) {

    const calculationStart = getPointOnCubicCurve(start, handle1, handle2, end, segment / segments),
          calculationEnd = getPointOnCubicCurve(start, handle1, handle2, end, (segment + 1) / segments),
          adjacentSide = Math.abs(calculationStart.x - calculationEnd.x),
          oppositeSide =  Math.abs(calculationStart.y - calculationEnd.y),
          segmentLength = trigonometry.getHypotenuse({ adjacentSide: adjacentSide, oppositeSide: oppositeSide });

    if (typeof segmentLength === "number")
      totalLength += roundOff(segmentLength);

    else {

      console.error("Calculated segment length for cubic path length returned as null.");
      break;

    }

  }

  return roundOff(totalLength);

}



// https://www.drububu.com/animation/beziercurves/index.html

// Get point on a path that's L, Q, or C.
export function getPointOnPath(startingPoint: Vector, endingPoint: Vector, handles: Vector[], position: number): Vector | null {

  if (handles.length === 0)
    return getPointOnLine(startingPoint, endingPoint, position);

  else if (handles.length === 1)
    return getPointOnQuadraticCurve(startingPoint, handles[0], endingPoint, position);

  else if (handles.length === 2)
    return getPointOnCubicCurve(startingPoint, handles[0], handles[1], endingPoint, position);

  else {
    
    console.error("More than 2 handles received for getPointOnPath. Parameter \"handles\" should not contain more than 2 Vectors.");
    return null;

  }

}


export function getPointOnLine(start: Vector, end: Vector, position: number): Vector {

  const x = start.x + (position * (end.x - start.x)),
        y = start.y + (position * (end.y - start.y));


  return { x: roundOff(x), y: roundOff(y) };

}


export function getPointOnQuadraticCurve(start: Vector, handle: Vector, end: Vector, position: number): Vector {

  const firstOrder = {
    handle1: getPointOnLine(start, handle, position),
    handle2: getPointOnLine(handle, end, position)
  };

  return getPointOnLine(firstOrder.handle1, firstOrder.handle2, position);

}


export function getPointOnCubicCurve(start: Vector, handle1: Vector, handle2: Vector, end: Vector, position: number): Vector {

  const firstOrder = {
    handle1: getPointOnLine(start, handle1, position),
    middle: getPointOnLine(handle1, handle2, position),
    handle2: getPointOnLine(handle2, end, position)
  };

  const secondOrder = {
    handle1: getPointOnLine(firstOrder.handle1, firstOrder.middle, position),
    handle2: getPointOnLine(firstOrder.middle, firstOrder.handle2, position)
  };

  return getPointOnLine(secondOrder.handle1, secondOrder.handle2, position);

}



// Gets the angle of a line.
export function getAbsoluteAngle(start: Vector, end: Vector): number {

  const moveDistance = { x: 0 - start.x, y: 0 - start.y },
        coordFromAbsoluteOrigin = { x: end.x + moveDistance.x, y: end.y + moveDistance.y };
      
  const angleRadians = Math.atan2(-coordFromAbsoluteOrigin.y, coordFromAbsoluteOrigin.x),
        angleDegrees = trigonometry.radToDeg(angleRadians);

  return roundOff(angleDegrees);

}


// Gets the nearest cardinal angle (NSEW) of the line.
export function getCardinalAngle(start: Vector, end: Vector): number {

  let angleDeg = getAbsoluteAngle(start, end);
  const excess = angleDeg % 90;

  if (excess < 45)
    angleDeg = angleDeg - excess;

  else
    angleDeg = angleDeg + (90 - excess);

  if (angleDeg === 360)
    angleDeg = 0;

  return Math.abs(angleDeg);

}


// Gets the nearest intercardinal angle of the line.
export function getIntercardinalAngle(start: Vector, end: Vector): number {

  let angleDeg = getAbsoluteAngle(start, end);
  const excess = angleDeg % 45;

  if (excess < 22.5)
    angleDeg = angleDeg - excess;

  else
    angleDeg = angleDeg + (45 - excess);

  if (angleDeg === 360)
    angleDeg = 0;

  return Math.abs(angleDeg);

}


// Gets the coords, given the angle and the distance.
export function getCoordsFromAbsoluteAngle(angleDegrees: number, distance: number): Vector {

  const angleRadians = angleDegrees * (Math.PI / 180),
        x = distance * Math.cos(angleRadians),
        y = distance * Math.sin(angleRadians);

  return { x: roundOff(x), y: roundOff(-y) };

}



// Gets the perpendicular angle, given an angle.
export function getPerpendicularAngle(angleDegrees: number, direction: "clockwise" | "counter-clockwise"): number {

  let perpendicularAngle = (direction === "clockwise") ?
    angleDegrees - 90 :
    angleDegrees + 90;

  if (perpendicularAngle > 360)
    perpendicularAngle -= 360;

  else if (perpendicularAngle < 0)
    perpendicularAngle += 360;

  return roundOff(perpendicularAngle);

}


// Gets a point perpendicular to an angle, given a distance.
export function getPointPerpendicularToAngle(angle: number, origin: Vector, distance: number, direction: "clockwise" | "counter-clockwise"): Vector {

  if (distance === 0)
    return origin;

  else {

    const perpendicularAngle = getPerpendicularAngle(angle, direction),
          relativeDistance = getCoordsFromAbsoluteAngle(perpendicularAngle, distance);

    return { x: origin.x + relativeDistance.x, y: origin.y + relativeDistance.y };

  }
  
}