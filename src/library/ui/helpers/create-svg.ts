export function icon(width: number, d: string, fill: string): SVGSVGElement {
  
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", `0 0 24 24`);
  svg.setAttribute("style", `fill: ${fill};`);
  svg.setAttribute("class", "icon");

  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute("clip-rule", "evenodd");
  path.setAttribute("d", d);

  svg.appendChild(path);

  svg.style.transform = `scale(${width / 24}`;

  return svg;

}


export function iconFreeform(width: number, height: number, d: string, fill: string): SVGSVGElement {
  
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("style", `fill: ${fill};`);
  svg.setAttribute("class", "icon");

  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute("clip-rule", "evenodd");
  path.setAttribute("d", d);

  svg.appendChild(path);

  return svg;

}