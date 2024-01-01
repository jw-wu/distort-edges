import "../../../dist/js/umd/distortedges.js";
import { svgPath } from "../paths/sun-flare.js";



const settings = {
  variableDistanceApart: true,
  minDistanceApart: 10,
  maxDistanceApart: 30,
  keepWithinOriginalSize: false
}

let recipe = {
  variableDistortionDistance: true,
  maximumDistortionDistance: 0,
  handleDistancePeak: 0.5,
  handleDistanceTrough: 0.5
};

// Create distorted path.
let distortion = new DistortedShape(svgPath, settings, recipe);

// Function to draw distorted edges.
function draw(svg) {

  svg.setAttribute("d", distortion.getDrawCommands(recipe));
  
}



// Draw the distorted edges for the edges of the nucleus.
document.addEventListener("DOMContentLoaded", () => {

  const svg = document.getElementById("sun-flare");

  // Start the flare shape with 0 maximumDistortionDistance, to ensure that the flares "grows" out from a nothing, so that it appears less jarring.
  recipe.maximumDistortionDistance = 0;
  draw(svg);

  recipe.maximumDistortionDistance = 12;
  window.setInterval(draw, 3000, svg);

});
