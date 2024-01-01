export function createRectangle(width, height) {

  return [
    `M0 0`,
    `L${width} 0`,
    `L${width} ${height}`,
    `L0 ${height}`,
    `Z`
  ].join("");

}