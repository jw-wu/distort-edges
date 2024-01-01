import { TextField } from "../ui/components/textfield/textfield.js";
import { Switch } from "../ui/components/switch/switch.js";
import { ControlList } from "../ui/components/control-list/control-list.js";
import { Button } from "../ui/components/button/button.js";



let title = document.createElement("div");
title.id = "title";
title.innerText = "Distort Edges";

export let useCustomPath = new Switch({
  variant: "contained",
  size: "medium",
  color: "primary",
  state: "off",
  label: "Use custom SVG d value",
  removeBottomBorder: true
});

export let shapeType = new ControlList({
  variant: "contained",
  color: "primary",
  size: "small",
  orientation: "horizontal",
  listItems: [ { optionName: "Ellipse" }, { optionName: "Rectangle" } ],
  callbacksOnClick: [ () => {} ],
  defaultOption: "Ellipse"
});

export let shapeWidth = new TextField({
  label: "Width (px)",
  inputType: "number",
  size: "large"
});

export let shapeHeight = new TextField({
  label: "Height (px)",
  inputType: "number",
  size: "large"
});

export let variableDistortionDistances = new Switch({
  variant: "contained",
  size: "medium",
  color: "primary",
  state: "off",
  label: "Variable distortion distances",
  removeBottomBorder: true
});

export let maximumDistortionDistance = new TextField({
  label: "Maximum distortion offset distance (px)",
  inputType: "number",
  size: "large"
});

export let variableDistancesBetweenPoints = new Switch({
  variant: "contained",
  size: "medium",
  color: "primary",
  state: "off",
  label: "Variable distances between points (px)",
  callbacks: [ toggleUniformDistances ],
  removeBottomBorder: true
});

export let minimumDistanceBetweenPoints = new TextField({
  label: "Minimum distance between points (px)",
  inputType: "number",
  size: "large"
});

export let maximumDistanceBetweenPoints = new TextField({
  label: "Maximum distance between points (px)",
  inputType: "number",
  size: "large"
});

export let distanceBetweenPoints = new TextField({
  label: "Distance between points (px)",
  inputType: "number",
  size: "large"
});

export let peakRoundness = new TextField({
  label: "Peak roundness (%)",
  inputType: "number",
  size: "large"
});

export let troughRoundness = new TextField({
  label: "Trough roundness (%)",
  inputType: "number",
  size: "large"
});

export let keepLayerDimensions = new Switch({
  variant: "contained",
  size: "medium",
  color: "primary",
  state: "on",
  label: "Keep layer dimensions",
  removeBottomBorder: false
});

export let refreshButton = new Button({
  variant: "outlined",
  color: "primary",
  size: "medium",
  label: "Refresh",
  callback: () => {},
  fit: "fill"
});

let secondaryButton = document.createElement("div");
secondaryButton.style.display = "flex";
secondaryButton.style.flexDirection = "row";
secondaryButton.style.columnGap = "0.5rem";
secondaryButton.style.width = "100%";
secondaryButton.style.padding = "1rem 1rem 0.5rem 1rem";
secondaryButton.append(refreshButton.node());

export let downloadButton = new Button({
  variant: "contained",
  color: "primary",
  size: "medium",
  label: "Download SVG",
  callback: () => {},
  fit: "fill"
});

export let downloadLink = document.createElement("a");
downloadLink.append(downloadButton.node());

let primaryButton = document.createElement("div");
primaryButton.style.width = "100%";
primaryButton.style.padding = "0 1rem 1rem 1rem";
primaryButton.append(downloadLink);



function toggleUniformDistances() {

	if (variableDistancesBetweenPoints.getInput()) {

		distanceBetweenPoints.node().style.display = "none";
		minimumDistanceBetweenPoints.node().style.display = "flex";
		maximumDistanceBetweenPoints.node().style.display = "flex";

	}

	else {

		minimumDistanceBetweenPoints.node().style.display = "none";
		maximumDistanceBetweenPoints.node().style.display = "none";
		distanceBetweenPoints.node().style.display = "flex";

	}

}



document.addEventListener("DOMContentLoaded", () => {

  const uiPanel = document.getElementById("ui");

  uiPanel.append(title);

  // uiPanel.append(useCustomPath.node());
  uiPanel.append(shapeType.node());
  uiPanel.append(shapeWidth.node());
  uiPanel.append(shapeHeight.node());

  uiPanel.append(variableDistortionDistances.node());
  uiPanel.append(maximumDistortionDistance.node());

  uiPanel.append(variableDistancesBetweenPoints.node());
  uiPanel.append(minimumDistanceBetweenPoints.node());
  minimumDistanceBetweenPoints.node().style.display = "none";
  uiPanel.append(maximumDistanceBetweenPoints.node());
  maximumDistanceBetweenPoints.node().style.display = "none";
  uiPanel.append(distanceBetweenPoints.node());
  
  uiPanel.append(peakRoundness.node());
  uiPanel.append(troughRoundness.node());

  uiPanel.append(keepLayerDimensions.node());

  uiPanel.append(secondaryButton);
  uiPanel.append(primaryButton);

  shapeWidth.setInput("200");
  shapeHeight.setInput("200");
  maximumDistortionDistance.setInput("20");
  distanceBetweenPoints.setInput("50");
  minimumDistanceBetweenPoints.setInput("10");
  maximumDistanceBetweenPoints.setInput("50");
  peakRoundness.setInput("50");
  troughRoundness.setInput("50");
  
});