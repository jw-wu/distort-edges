import "../../../dist/js/umd/distortedges.js";
import { originalShape } from "../paths/time.js";



const svg = document.getElementById("distorted-node-2");

let settings = {
  variableDistanceApart: false,
  distanceApart: 24,
  keepWithinOriginalSize: true
};

let recipe = {
  variableDistortionDistance: true,
  maximumDistortionDistance: 16,
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
    recipe.maximumDistortionDistance = 24;
    recipe.handleDistancePeak = 0.5;
    recipe.handleDistanceTrough = 1;

    svg.setAttribute("d", distortion.getDrawCommands(recipe));

  }

  else {

    recipe.variableDistortionDistance = false;
    recipe.handleDistanceTrough = 0.5;

    // Sets it so that the animation will go the other way once it has reached the maximum distance or the minimum.
    if (recipe.maximumDistortionDistance >= 58)
      inwards = true;

    else if (recipe.maximumDistortionDistance <= 8)
      inwards = false;


    if (inwards) {

      recipe.maximumDistortionDistance -= 2.5;

      if (recipe.handleDistancePeak >= 0.5)
        recipe.handleDistancePeak -= 0.05;

    }

    else {

      recipe.maximumDistortionDistance += 2.5;

      if (recipe.handleDistancePeak <= 1)
        recipe.handleDistancePeak += 0.05;

    }

    svg.setAttribute("d", distortion.getDrawCommands(recipe));

  }

}



// Create SVG path variables with distortions.
svg.setAttribute("d", distortion.getDrawCommands(recipe));
window.setInterval(redraw, 1000);