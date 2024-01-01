export function createEllipse(width, height) {

  return [
    `M${width / 2} ${height}`,
    `C${(77.6142 / 100) * width} ${height} ${width} ${(77.6142 / 100) * height} ${width} ${height / 2}`,
    `C${width} ${(22.3858 / 100) * height} ${(77.6142 / 100) * width} 0 ${width / 2} 0`,
    `C${(22.3858 / 100) * width} 0 0 ${(22.3858 / 100) * height} 0 ${height / 2}`,
    `C0 ${(77.6142 / 100) * height} ${(22.3858 / 100) * width} ${height} ${width / 2} ${height}`,
    `Z`
  ].join("");

}