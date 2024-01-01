export function radToDeg(radian: number): number {

  return radian * (180 / Math.PI);

}



export function degToRad(degree: number): number {

  return degree * (Math.PI / 180);

}



// For those who, like me, are not mathematically-inclined:
// https://www.mathsisfun.com/algebra/trig-finding-side-right-triangle.html

// Only right angled triangles now.
export function getHypotenuse( input: { adjacentSide?: number, oppositeSide?: number, angle?: number } ): number | null {

  let argumentCount = 0;

  if (typeof input.adjacentSide !== "undefined" && !isNaN(input.adjacentSide)) {

    ++argumentCount;
    input.adjacentSide = Math.abs(input.adjacentSide);

  }

  if (typeof input.oppositeSide !== "undefined" && !isNaN(input.oppositeSide)) {

    ++argumentCount;
    input.oppositeSide = Math.abs(input.oppositeSide);

  }

  if (typeof input.angle !== "undefined" && !isNaN(input.angle)) {

    ++argumentCount;
    input.angle = Math.abs(input.angle);

  }

  if (argumentCount < 2)
    console.log("%cNot enough values to calculate the hypotenuse of the triangle.", "color: #f30;");

  else {

    // Pythagoras theorem.
    if (typeof input.adjacentSide === "number" && typeof input.oppositeSide === "number")
      return Math.sqrt(input.adjacentSide * input.adjacentSide + input.oppositeSide * input.oppositeSide) || 0;

    else if (typeof input.oppositeSide === "number" && typeof input.angle === "number")
      return Math.abs(input.oppositeSide / Math.sin(degToRad(input.angle)));

    else if (typeof input.adjacentSide === "number" && typeof input.angle === "number")
      return Math.abs(input.adjacentSide / Math.cos(degToRad(input.angle)));

  }

  return null;

}



export function getAdjacent( input: { hypotenuse?: number, oppositeSide?: number, angle?: number } ): number | null {

  let argumentCount = 0;

  if (typeof input.hypotenuse !== "undefined" && !isNaN(input.hypotenuse)) {

    ++argumentCount;
    input.hypotenuse = Math.abs(input.hypotenuse);

  }

  if (typeof input.oppositeSide !== "undefined" && !isNaN(input.oppositeSide)) {

    ++argumentCount;
    input.oppositeSide = Math.abs(input.oppositeSide);

  }

  if (typeof input.angle !== "undefined" && !isNaN(input.angle)) {

    ++argumentCount;
    input.angle = Math.abs(input.angle);

  }

  if (argumentCount < 2)
    console.log("%cNot enough values to calculate the adjacent side of the triangle.", "color: #f30;");

  else {

    // Angle is always next to "adjacent".
    let oppositeAngle = (input.angle) ? 90 - input.angle : undefined;

    // Pythagoras theorem.
    if (typeof input.hypotenuse === "number" && typeof input.oppositeSide === "number")
      return Math.sqrt(input.hypotenuse * input.hypotenuse + input.oppositeSide * input.oppositeSide);

    else if (typeof input.oppositeSide === "number" && typeof oppositeAngle === "number")
      return Math.abs(input.oppositeSide / Math.tan(degToRad(oppositeAngle)));

    else if (typeof input.hypotenuse === "number" && typeof oppositeAngle === "number")
      return Math.abs(Math.cos(degToRad(oppositeAngle)) * input.hypotenuse);

  }

  return null;

}



export function getOpposite( input: { hypotenuse?: number, adjacentSide?: number, angle?: number } ): number | null {

  let argumentCount = 0;

  if (typeof input.hypotenuse !== "undefined" && !isNaN(input.hypotenuse)) {

    ++argumentCount;
    input.hypotenuse = Math.abs(input.hypotenuse);

  }

  if (typeof input.adjacentSide !== "undefined" && !isNaN(input.adjacentSide)) {

    ++argumentCount;
    input.adjacentSide = Math.abs(input.adjacentSide);

  }

  if (typeof input.angle !== "undefined" && !isNaN(input.angle)) {

    ++argumentCount;
    input.angle = Math.abs(input.angle);

  }

  if (argumentCount < 2)

    console.log("%cNot enough values to calculate the opoosite side of the triangle.", "color: #f30;");

  else {

    // Pythagoras theorem.
    if (typeof input.hypotenuse !== "undefined" && typeof input.adjacentSide !== "undefined")
      return Math.sqrt(input.hypotenuse * input.hypotenuse + input.adjacentSide * input.adjacentSide);

    else if (typeof input.hypotenuse !== "undefined" && typeof input.angle !== "undefined")
      return Math.abs(Math.sin(degToRad(input.angle)) * input.hypotenuse);

    else if (typeof input.adjacentSide !== "undefined" && typeof input.angle !== "undefined")
      return Math.abs(Math.tan(degToRad(input.angle)) * input.adjacentSide);
    
  }

  return null;

}