import "../../dist/js/umd/distortedges.js";
import { createSVG } from "./create-svg.js";
import { getPath } from "./shape/get-path.js";
import * as ui from "./ui.js";



document.addEventListener("DOMContentLoaded", () => {
  
  window.scrollTo(0, 1);

  const preview = document.getElementById("preview");

  window.createDistortedShape = () => {

    // Create base path from dimensions.
    const width = Number(ui.shapeWidth.getInput()),
          height = Number(ui.shapeHeight.getInput());

    const path = getPath(ui.shapeType.getInput(), width, height);

    // Get settings and recipe from input.
    let settings = (ui.variableDistancesBetweenPoints.getInput()) ? {
      variableDistanceApart: ui.variableDistancesBetweenPoints.getInput(),
      minDistanceApart: Number(ui.minimumDistanceBetweenPoints.getInput()),
      maxDistanceApart: Number(ui.maximumDistanceBetweenPoints.getInput()),
      keepWithinOriginalSize: ui.keepLayerDimensions.getInput()
    } : {
      variableDistanceApart: ui.variableDistancesBetweenPoints.getInput(),
      distanceApart: Number(ui.distanceBetweenPoints.getInput()),
      keepWithinOriginalSize: ui.keepLayerDimensions.getInput()
    };
    
    let recipe = {
      variableDistortionDistance: ui.variableDistortionDistances.getInput(),
      maximumDistortionDistance: Number(ui.maximumDistortionDistance.getInput()),
      handleDistancePeak: Number(ui.peakRoundness.getInput()) / 100,
      handleDistanceTrough: Number(ui.troughRoundness.getInput()) / 100,
    };
  
    const distortion = new DistortedShape(path, settings, recipe),
          svg = createSVG({ width: width, height: height, d: distortion.getDrawCommands(), fill: "#000" });
  
    preview.innerHTML = "";
    preview.append(svg);

    createDownloadLink();

  }

  window.createDownloadLink = () => {

    const svg = preview.children[0].outerHTML,
          blob = new Blob([ svg.toString() ]),
          date = new Date();

    ui.downloadLink.download = `distortedges-${date.getFullYear()}${date.getMonth()}${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}.svg`;
    ui.downloadLink.href = URL.createObjectURL(blob, { "type": "image/svg+wml" });

  }

  // For UI elements to finsih setting up.
  window.setTimeout(createDistortedShape, 200);

  ui.shapeType.node().setAttribute("onclick", "createDistortedShape()");
  ui.shapeWidth.node().setAttribute("onkeyup", "createDistortedShape()");
  ui.shapeWidth.node().setAttribute("onclick", "createDistortedShape()");
  ui.shapeHeight.node().setAttribute("onkeyup", "createDistortedShape()");
  ui.shapeHeight.node().setAttribute("onclick", "createDistortedShape()");

  ui.variableDistortionDistances.node().setAttribute("onchange", "createDistortedShape()");
  ui.maximumDistortionDistance.node().setAttribute("onkeyup", "createDistortedShape()");
  ui.maximumDistortionDistance.node().setAttribute("onclick", "createDistortedShape()");

  ui.variableDistancesBetweenPoints.node().setAttribute("onchange", "createDistortedShape()");
  ui.minimumDistanceBetweenPoints.node().setAttribute("onkeyup", "createDistortedShape()");
  ui.minimumDistanceBetweenPoints.node().setAttribute("onclick", "createDistortedShape()");
  ui.maximumDistanceBetweenPoints.node().setAttribute("onkeyup", "createDistortedShape()");
  ui.maximumDistanceBetweenPoints.node().setAttribute("onclick", "createDistortedShape()");
  ui.distanceBetweenPoints.node().setAttribute("onkeyup", "createDistortedShape()");
  ui.distanceBetweenPoints.node().setAttribute("onclick", "createDistortedShape()");

  ui.peakRoundness.node().setAttribute("onkeyup", "createDistortedShape()");
  ui.peakRoundness.node().setAttribute("onclick", "createDistortedShape()");
  ui.troughRoundness.node().setAttribute("onkeyup", "createDistortedShape()");
  ui.troughRoundness.node().setAttribute("onclick", "createDistortedShape()");

  ui.keepLayerDimensions.node().setAttribute("onchange", "createDistortedShape()");

  ui.refreshButton.node().setAttribute("onclick", "createDistortedShape()");
  // ui.downloadButton.node().setAttribute("onclick", "downloadSVG()");

});