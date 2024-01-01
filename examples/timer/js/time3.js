import "../../../dist/js/umd/distortedges.js";
import { originalShape } from "../paths/time.js";



const svg = document.getElementById("distorted-node-3");

let settings = {
  variableDistanceApart: false,
  distanceApart: 8,
  keepWithinOriginalSize: true
};

let recipe = {
  variableDistortionDistance: true,
  maximumDistortionDistance: 8,
  handleDistancePeak: 0.5,
  handleDistanceTrough: 0.5,
}

// For setting the inwards/outwards animation of time3, when variableDistanceApart is false.
let inwards = true;

// Set up distorted shapes.
let distortion = new DistortedShape(originalShape, settings, recipe);

// For storing current state of distortion variant.
let variableDistortion = true;

export function toggleVariableDistortion(state) {

  variableDistortion = state;
  redraw();

}


// Functions to recreate SVG.
function redraw() {

  if (variableDistortion) {

    recipe.variableDistortionDistance = true;
    recipe.maximumDistortionDistance = 4;
    recipe.handleDistanceTrough = 0.5;

    svg.setAttribute("d", distortion.getDrawCommands(recipe));

  }

  else {

    recipe.variableDistortionDistance = false;
    recipe.handleDistanceTrough = 1;

    // Sets it so that the animation will go the other way once it has reached the maximum distance or the minimum.
    if (recipe.maximumDistortionDistance >= 56)
      inwards = true;

    else if (recipe.maximumDistortionDistance <= 5)
      inwards = false;


    if (inwards)
      recipe.maximumDistortionDistance -= 2.5;

    else
      recipe.maximumDistortionDistance += 2.5;

    svg.setAttribute("d", distortion.getDrawCommands(recipe));

  }

}



// Create SVG path variables with distortions.
svg.setAttribute("d", distortion.getDrawCommands(recipe));
window.setInterval(redraw, 100);