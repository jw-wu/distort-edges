export function radToDeg(radian: number): number {
  return radian * (180 / Math.PI);
}



export function degToRad(degree: number): number {
  return degree * (Math.PI / 180);
}



// For those who, like me, are not mathematically-inclined:
// https://www.mathsisfun.com/algebra/trig-finding-side-right-triangle.html

// Only right angled triangles now.
export function getHypotenuse( base: { adjacentSide?: number, oppositeSide?: number, angle?: number } ): number | null {

  let argumentCount = 0;

  if (base.adjacentSide) {
    ++argumentCount;
    base.adjacentSide = Math.abs(base.adjacentSide);
  }

  if (base.oppositeSide) {
    ++argumentCount;
    base.oppositeSide = Math.abs(base.oppositeSide);
  }

  if (base.angle) {
    ++argumentCount;
    base.angle = Math.abs(base.angle);
  }

  if (argumentCount < 2)
    console.log("%cNot enough values to calculate the hypotenuse of the triangle.", "color: #f30;");

  else {

    // Pythagoras theorem.
    if (base.adjacentSide && base.oppositeSide)
      return Math.sqrt(base.adjacentSide * base.adjacentSide + base.oppositeSide * base.oppositeSide);

    else if (base.oppositeSide && base.angle)
      return Math.abs(base.oppositeSide / Math.sin(degToRad(base.angle)));

    else if (base.adjacentSide && base.angle)
      return Math.abs(base.adjacentSide / Math.cos(degToRad(base.angle)));
  }

  return null;

}



export function getAdjacent( base: { hypotenuse?: number, oppositeSide?: number, angle?: number } ): number | null {

  let argumentCount = 0;
  if (base.hypotenuse!) {
    ++argumentCount;
    base.hypotenuse = Math.abs(base.hypotenuse);
  }

  if (base.oppositeSide) {
    ++argumentCount;
    base.oppositeSide = Math.abs(base.oppositeSide);
  }

  if (base.angle) {
    ++argumentCount;
    base.angle = Math.abs(base.angle);
  }

  if (argumentCount < 2)
    console.log("%cNot enough values to calculate the adjacent side of the triangle.", "color: #f30;");

  else {

    // Angle is always next to "adjacent".
    let oppositeAngle = (base.angle) ? 90 - base.angle : undefined;

    // Pythagoras theorem.
    if (base.hypotenuse && base.oppositeSide)
      return Math.sqrt(base.hypotenuse * base.hypotenuse + base.oppositeSide * base.oppositeSide);

    else if (base.oppositeSide && oppositeAngle)
      return Math.abs(base.oppositeSide / Math.tan(degToRad(oppositeAngle)));

    else if (base.hypotenuse && oppositeAngle)
      return Math.abs(Math.cos(degToRad(oppositeAngle)) * base.hypotenuse);
  }

  return null;

}



export function getOpposite( base: { hypotenuse?: number, adjacentSide?: number, angle?: number } ): number | null {

  let argumentCount = 0;
  if (base.hypotenuse) {
    ++argumentCount;
    base.hypotenuse = Math.abs(base.hypotenuse);
  }

  if (base.adjacentSide) {
    ++argumentCount;
    base.adjacentSide = Math.abs(base.adjacentSide);
  }

  if (base.angle) {
    ++argumentCount;
    base.angle = Math.abs(base.angle);
  }

  if (argumentCount < 2)
    console.log("%cNot enough values to calculate the opoosite side of the triangle.", "color: #f30;");

  else {

    // Pythagoras theorem.
    if (base.hypotenuse && base.adjacentSide)
      return Math.sqrt(base.hypotenuse * base.hypotenuse + base.adjacentSide * base.adjacentSide);

    else if (base.hypotenuse && base.angle)
      return Math.abs(Math.sin(degToRad(base.angle)) * base.hypotenuse);

    else if (base.adjacentSide && base.angle)
      return Math.abs(Math.tan(degToRad(base.angle)) * base.adjacentSide);
  }

  return null;

}