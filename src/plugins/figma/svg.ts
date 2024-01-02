/* Plugins */
import * as vectorManipulation from "../general/vector";



// Export layer as an SVG from Figma. Returns the SVG code.
export async function getCode(node: SceneNode): Promise<string> {

  let bytes:Uint8Array = await node.exportAsync({
    format: "SVG",
    svgOutlineText: true,
    svgIdAttribute: false,
    svgSimplifyStroke: false
  });

  return String.fromCharCode.apply(null, Array.from(bytes));
  
}


// Add support for rects, etc.
export function svgToVectorPath(svgCode: string): string {

  // Get all the paths in the svg.
  let paths = [ ];

  while(svgCode.includes("<path")) {

    const start = svgCode.indexOf("<path"),
          end = svgCode.indexOf(">");

    paths.push(svgCode.substring(start, end + 1));

    // Remove the saved path from the input.
    svgCode = svgCode.substring(end + 1);

  }

  // Get vector path by consolidating all SVG paths into 1. Take note of evenodd winding paths.
  let vectorPath = "";

  for (let path of paths) {

    vectorPath = (vectorPath.length === 0)
      ? simplifySvgD(path)
      : [ vectorPath, simplifySvgD(path) ].join(" ");

  }

  return vectorPath;

}


// Simply SVG d paths to VectorPath format.
export function simplifySvgD(svgCode: string): string {

  // Gets string starting after d="M.
  let d = svgCode;

  if (/d=\"/.test(svgCode)) {

    const dStart = svgCode.indexOf("d=") + 3,
          dEnd = svgCode.substring(dStart).indexOf("\"") + dStart;

    d = svgCode.substring(dStart, dEnd);
    
  }


  // Replaces "A0" => "A 0", "0A" => "0 A", "AA" => "A A".
  while(d.search(/([MLHVCSQAZ]\d)|(\d[MLHVCSQAZ])|(Z[MLHVCSQAZ])/i) > -1) {

    const secondCharPos = d.search(/([A-Z]\d)|(\d[A-Z])|([A-Z][A-Z])/i) + 1;
    d = [ d.substring(0, secondCharPos), d.substring(secondCharPos) ].join(" ");

  }


  // Translates SVG d commands to Figma vector commands. Only contains instructions for M, L, V and H for now.
  return simplifySvgCommands(d);

}


// For a primer: https://css-tricks.com/svg-path-syntax-illustrated-guide/
export function simplifySvgCommands(d: string): string {

  // Store latest x and y values along the way as V and H commands do not have full pair of coords.
  let x = 0, y = 0;
  
  // Data to return.
  let vectorData = "";

  // Regex for all commands.
  const allValidCommandDirections = new RegExp("[MLVHCSQTAZ]", "i");

  // Storage for previous command and handle.
  let previousCommand = "",
      previousHandle = { x: 0, y: 0 };


  // Searches for commands and translates them.
  while(d.search(allValidCommandDirections) > -1) {

    let commandDirectionPosition = d.search(allValidCommandDirections),
        commandDirection = d.substring(commandDirectionPosition, commandDirectionPosition + 1),
        coords: number[] = [ ];

    // Retreive coords for each drawing chunk.
    if (commandDirection !== "Z")
      [ coords, d ] = extractCoords(d);


    switch(commandDirection) {

      case "M":

        x = coords[0];
        y = coords[1];

        // If M is not the first in the path, add the existing data to it.
        vectorData = (vectorData.length === 0 ) ?
          `${commandDirection} ${x} ${y}`:
          `${vectorData} ${commandDirection} ${x} ${y}`;

        break;


      case "m":

        x += coords[0];
        y += coords[1];

        vectorData = (vectorData.length === 0 ) ?
          `${commandDirection} ${x} ${y}`:
          `${vectorData} ${commandDirection} ${x} ${y}`;

      break;


      case "L":

        x = coords[0];
        y = coords[1];

        vectorData = (vectorData.length === 0 ) ?
          `M ${x} ${y} ${commandDirection} ${x} ${y}`:
          `${vectorData} ${commandDirection} ${x} ${y}`;

        break;


      case "H":

        x = coords[0];

        vectorData = `${vectorData} L ${x} ${y}`;
        
        break;

        
      case "V":

        y = coords[0];

        vectorData = `${vectorData} L ${x} ${y}`;

        break;


      case "C":

        x = coords[4];
        y = coords[5];

        vectorData = `${vectorData} C ${coords[0]} ${coords[1]} ${coords[2]} ${coords[3]} ${x} ${y}`;

        previousHandle = { x: coords[2], y: coords[3] };

        break;


      case "S":

        x = coords[2];
        y = coords[3];

        if (previousCommand === "C" || previousCommand == "S") {

          const assumedHandle = vectorManipulation.flipHandle(previousHandle, { x: x, y: y });
          vectorData = `${vectorData} C ${assumedHandle.x} ${assumedHandle.y} ${coords[0]} ${coords[1]} ${x} ${y}`;

        }

        else 
          vectorData = `${vectorData} C ${x} ${y} ${coords[0]} ${coords[1]} ${x} ${y}`;

        previousHandle = { x: coords[0], y: coords[1] };

        break;


      case "Q":

        x = coords[2];
        y = coords[3];

        vectorData = `${vectorData} Q ${coords[0]} ${coords[1]} ${x} ${y}`;

        previousHandle = { x: coords[0], y: coords[1] };

        break;


      case "T":

        x = coords[0];
        y = coords[1];

        if (previousCommand === "Q" || previousCommand === "T") {

          const assumedHandle = vectorManipulation.flipHandle(previousHandle, { x: x, y: y });
          vectorData = `${vectorData} Q ${assumedHandle.x} ${assumedHandle.y} ${x} ${y}`;

          previousHandle = { x: assumedHandle.x, y: assumedHandle.y };

        }

        else
          vectorData = `${vectorData} L ${x} ${y}`;

        break;


      case "Z":

        vectorData = `${vectorData} Z`;
        d = (d.search(/Z./) > -1) ? d.substring(1) : "";

        break;
        
    }

    // Stores the current command for use in the next command search.
    previousCommand = commandDirection;

  }

  return vectorData;

}


// TODO
/* Use  start = d.search(/[-\d]|Z/),
        end = d.substring(start).search(/[MLVHCSQTA]/i) + start
        
  and remove d = (d.search(/Z./) > -1) ? d.substring(1) : ""; from switch above
*/

function extractCoords(d: string): [ number[], string ] {

  const chunkStart = d.search(/[-\d]/),
        chunkEnd = d.substring(chunkStart).search(/[MLVHCSQTAZ]/i) + chunkStart,
        values = d.substring(chunkStart, chunkEnd).split(" ");

  let coords: number[] = [ ];

  // Values returns empty spaces if layer is rotated.
  for (let value of values) {

    if (!isNaN(Number(value)))
      coords.push(Number(Number(value).toFixed(15)));

  }
  
  return [ coords, d.substring(chunkEnd) ];

}