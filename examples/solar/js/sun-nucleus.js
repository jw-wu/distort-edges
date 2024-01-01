import "../../../dist/js/umd/distortedges.js";
import { svgPath } from "../paths/sun-nucleus.js";



const settings = {
  variableDistanceApart: false,
  distanceApart: 3,
  keepWithinOriginalSize: false
};

const recipe = {
  variableDistortionDistance: true,
  maximumDistortionDistance: 0.75,
  handleDistancePeak: 0.5,
  handleDistanceTrough: 0.5
};

// Create distorted path.
let distortion = new DistortedShape(svgPath, settings, recipe);

// Function to draw distorted edges.
function draw(svg) {

  // Recipe is not passed as a parameter as it does not change, and is stored in when the class was created.
  svg.setAttribute("d", distortion.getDrawCommands());
  
}



// Draw the distorted edges for the edges of the nucleus.
document.addEventListener("DOMContentLoaded", () => {

  const svg = document.getElementById("sun-nucleus");

  draw(svg);
  window.setInterval(draw, 500, svg);

});
