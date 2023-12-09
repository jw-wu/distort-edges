import { DistortedEdges } from "../../dist/js/module/distortedges.js";

let recipe =  { time1:  { variableDistortionDistance: true,
                          maximumDistortionDistance: 24,
                          variableDistanceApart: false,
                          distanceApart: 10,
                          handleDistancePeak: 0.5,
                          handleDistanceTrough: 0.5,
                          keepWithinOriginalSize: false
                        },
                time2:  { variableDistortionDistance: true,
                          maximumDistortionDistance: 8,
                          variableDistanceApart: false,
                          distanceApart: 10,
                          handleDistancePeak: 0.5,
                          handleDistanceTrough: 0.5,
                          keepWithinOriginalSize: false
                },
                time3:  { variableDistortionDistance: true,
                          maximumDistortionDistance: 5,
                          variableDistanceApart: false,
                          distanceApart: 3,
                          handleDistancePeak: 0.5,
                          handleDistanceTrough: 0.5,
                          keepWithinOriginalSize: false
                        }
};

// For setting the state of the edges, controlled by a switch interface.
let roughenedEdges = true;

// For setting the inwards/outwards animation of time3, when variableDistanceApart is false.
let inwards = {
  time1: true,
  time2: true,
  time3: true
};

// Set up distorted shapes.
let distortedNode = new DistortedEdges(
  "M200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0C155.228 0 200 44.7715 200 100Z",
  recipe.time1
);

// Create SVG path variables with distortions.
document.documentElement.style.setProperty("--d-time1", `path("${distortedNode.getDrawCommands(recipe.time1)}")`);
document.documentElement.style.setProperty("--d-time2", `path("${distortedNode.getDrawCommands(recipe.time2)}")`);
document.documentElement.style.setProperty("--d-time3", `path("${distortedNode.getDrawCommands(recipe.time3)}")`);

window.setInterval(refreshSVGPath, 3000, "--d-time1");
window.setInterval(refreshSVGPath, 1000, "--d-time2");
window.setInterval(refreshSVGPath, 100, "--d-time3");


// Sets up blinking animation for semi-colons.
const semicolonElements = document.querySelectorAll(".semicolon");
window.setInterval(() => {

  if (semicolonElements[0].style.visibility === "hidden") {

    for (let element of semicolonElements) {
      element.style.visibility = "visible";
    }

  }

  else {

    for (let element of semicolonElements) {
      element.style.visibility = "hidden";
    }

  }

}, 1000);


const toggleModeSwitch = document.getElementById("toggle-mode");
toggleModeSwitch.addEventListener("change", toggleMode);

function toggleMode(e) {

  if (e.currentTarget.checked) {

    document.documentElement.style.setProperty("--color-object", "#fff");
    document.documentElement.style.setProperty("--color-bg", "#000");

  }

  else {

    document.documentElement.style.setProperty("--color-object", "#000");
    document.documentElement.style.setProperty("--color-bg", "#fff");

  }

}


const toggleEdgeSwitch = document.getElementById("toggle-edge");
toggleEdgeSwitch.addEventListener("change", toggleEdge);


function toggleEdge(e) {

  if (e.currentTarget.checked) {

    recipe.time1.distanceApart = 140;
    recipe.time1.variableDistortionDistance = false;
    recipe.time1.keepWithinOriginalSize = true;

    recipe.time2.distanceApart = 14;
    recipe.time2.variableDistortionDistance = false;
    recipe.time2.keepWithinOriginalSize = true;

    recipe.time3.maximumDistortionDistance = 1;
    recipe.time3.variableDistortionDistance = false;
    recipe.time3.keepWithinOriginalSize = true;

    document.documentElement.style.setProperty("--d-time1", `path("${distortedNode.getDrawCommands(recipe.time1)}")`);
    document.documentElement.style.setProperty("--d-time2", `path("${distortedNode.getDrawCommands(recipe.time2)}")`);
    document.documentElement.style.setProperty("--d-time3", `path("${distortedNode.getDrawCommands(recipe.time3)}")`);

    roughenedEdges = false;

  }

  else {

    recipe.time1.distanceApart = 10;
    recipe.time1.variableDistortionDistance = true;
    recipe.time1.keepWithinOriginalSize = false;

    recipe.time2.distanceApart = 10;
    recipe.time2.variableDistortionDistance = true;
    recipe.time1.keepWithinOriginalSize = false;

    recipe.time3.distanceApart = 3;
    recipe.time3.variableDistortionDistance = true;
    recipe.time1.keepWithinOriginalSize = false;

    document.documentElement.style.setProperty("--d-time1", `path("${distortedNode.getDrawCommands(recipe.time1)}")`);
    document.documentElement.style.setProperty("--d-time2", `path("${distortedNode.getDrawCommands(recipe.time2)}")`);
    document.documentElement.style.setProperty("--d-time3", `path("${distortedNode.getDrawCommands(recipe.time3)}")`);

    roughenedEdges = true;

  }

}


// Function to recreate SVG every 1s.
function refreshSVGPath(pathVar) {

  switch (pathVar) {

    case "--d-time1":

      if (roughenedEdges) {

        recipe.time1.maximumDistortionDistance = 24;
        recipe.time1.handleDistancePeak = 0.5;

      }

      else {

        // Sets it so that the animation will go the other way once it has reached the maximum distance or the minimum.
        if (recipe.time1.maximumDistortionDistance >= 74)
          inwards.time1 = true;

        else if (recipe.time1.maximumDistortionDistance <= 24)
          inwards.time1 = false;


        if (inwards.time1) {

          recipe.time1.maximumDistortionDistance -= 2.5;

          if (recipe.time1.handleDistancePeak >= 0.5)
            recipe.time1.handleDistancePeak -= 0.1;

      }

      else {

        recipe.time1.maximumDistortionDistance += 2.5;

        if (recipe.time1.handleDistancePeak <= 1)
          recipe.time1.handleDistancePeak += 0.1;

      }

      }

      document.documentElement.style.setProperty(pathVar, `path("${distortedNode.getDrawCommands(recipe.time1)}")`);

      break;


  case "--d-time2":

    if (roughenedEdges) {

      recipe.time2.maximumDistortionDistance = 8;
      recipe.time2.handleDistancePeak = 0.5;

    }

    else {

      // Sets it so that the animation will go the other way once it has reached the maximum distance or the minimum.
      if (recipe.time2.maximumDistortionDistance >= 58)
        inwards.time2 = true;

      else if (recipe.time2.maximumDistortionDistance <= 8)
        inwards.time2 = false;


      if (inwards.time2) {

        recipe.time2.maximumDistortionDistance -= 2.5;

        if (recipe.time2.handleDistancePeak >= 0.5)
          recipe.time2.handleDistancePeak -= 0.05;

      }

      else {

        recipe.time2.maximumDistortionDistance += 2.5;

        if (recipe.time2.handleDistancePeak <= 1)
          recipe.time2.handleDistancePeak += 0.05;

      }

    }

    document.documentElement.style.setProperty(pathVar, `path("${distortedNode.getDrawCommands(recipe.time2)}")`);

    break;


  case "--d-time3":

    if (roughenedEdges) {

      recipe.time3.maximumDistortionDistance = 4;
      recipe.time3.handleDistancePeak = 0.5;

    }

    else {

      // Sets it so that the animation will go the other way once it has reached the maximum distance or the minimum.
      if (recipe.time3.maximumDistortionDistance >= 55)
        inwards.time3 = true;

      else if (recipe.time3.maximumDistortionDistance <= 5)
        inwards.time3 = false;


      if (inwards.time3) {

        recipe.time3.maximumDistortionDistance -= 2.5;

        if (recipe.time3.handleDistancePeak >= 0.5)
          recipe.time3.handleDistancePeak -= 0.05;

      }

      else {

        recipe.time3.maximumDistortionDistance += 2.5;

        if (recipe.time3.handleDistancePeak <= 1)
          recipe.time3.handleDistancePeak += 0.05;

      }

    }

    document.documentElement.style.setProperty(pathVar, `path("${distortedNode.getDrawCommands(recipe.time3)}")`);

    break;

  }

}