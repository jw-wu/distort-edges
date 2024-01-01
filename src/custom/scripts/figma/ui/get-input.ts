// Checks user input and sends them back to the GUI to forward to the app.


/* System */
import * as consoleTheme from "../../../../library/console-theme";

/* UI */
import {
  variableDistortionDistance,
  maxDistortionDistance,
  variableDistanceBetweenPoints,
  distanceBetweenPoints,
  minDistanceBetweenPoints,
  maxDistanceBetweenPoints,
  peakRoundness,
  troughRoundness,
  keepLayerDimensions,
	forceDistortion
} from "./gui";

/* Engine */
import { DistortEdgesRecipe } from "../../engine/distortion/recipe";
import { ExtendedVectorNodeModelSettings } from "../../../../plugins/figma/vectornode-model-extended";



export function getInput(): { settings: ExtendedVectorNodeModelSettings, recipe: DistortEdgesRecipe } {

	// Distortion distance.
	const maxDistortionDistanceInput = Number(maxDistortionDistance.getInput()),
				variableDistortionDistanceInput = variableDistortionDistance.getInput();

	if (isNaN(maxDistortionDistanceInput) || maxDistortionDistanceInput < 0)
		maxDistortionDistance.setError("Maximum distortion distance must be a positive number above 0.");

	else
		maxDistortionDistance.clearError();


	// Variable distance between points.
	const variableDistanceBetweenPointsInput = variableDistanceBetweenPoints.getInput();
	let distanceBetweenPointsInput = 0,
			minDistanceBetweenPointsInput = 0,
			maxDistanceBetweenPointsInput = 0;

	if (!variableDistanceBetweenPointsInput) {

		// Distance between points.
		distanceBetweenPointsInput = Number(distanceBetweenPoints.getInput());

		if (isNaN(distanceBetweenPointsInput) || distanceBetweenPointsInput <= 0)
			distanceBetweenPoints.setError("Distance must be a positive number above 0.");

		else
			distanceBetweenPoints.clearError();

	}

	else {

		minDistanceBetweenPointsInput = Number(minDistanceBetweenPoints.getInput());

		if (isNaN(minDistanceBetweenPointsInput) || minDistanceBetweenPointsInput <= 0)
			minDistanceBetweenPoints.setError("Distance must be a positive number above 0.");

		else
			minDistanceBetweenPoints.clearError();


		maxDistanceBetweenPointsInput = Number(maxDistanceBetweenPoints.getInput());

		if (isNaN(maxDistanceBetweenPointsInput) || maxDistanceBetweenPointsInput <= 0)
			maxDistanceBetweenPoints.setError("Distance must be a positive number above 0.");

		else
			maxDistanceBetweenPoints.clearError();

	}


	// Roundness.
	const peakRoundnessInput = Number(peakRoundness.getInput()),
				troughRoundnessInput = Number(troughRoundness.getInput());

	if (isNaN(peakRoundnessInput) || peakRoundnessInput < 0)
		peakRoundness.setError("Peak roundness must be a positive number above 0.");

	else
		peakRoundness.clearError();

	if (isNaN(troughRoundnessInput) || troughRoundnessInput < 0)
		troughRoundness.setError("Trough roundness must be a positive number above 0.");

	else
		troughRoundness.clearError();


	// Keep layer dimensions.
	const keepLayerDimensionsInput = keepLayerDimensions.getInput();


	// Force distortion
	const forceDistortionInput = forceDistortion.getInput();


	const settings: ExtendedVectorNodeModelSettings = {
		variableDistanceApart: variableDistanceBetweenPointsInput,
  	distanceApart: distanceBetweenPointsInput,
  	minDistanceApart: minDistanceBetweenPointsInput,
		maxDistanceApart: maxDistanceBetweenPointsInput,
  	keepWithinOriginalSize: keepLayerDimensionsInput
	}

	const recipe: DistortEdgesRecipe = {
		variableDistortionDistance: variableDistortionDistanceInput,
    maximumDistortionDistance: maxDistortionDistanceInput,
    handleDistancePeak: peakRoundnessInput / 100,
    handleDistanceTrough: troughRoundnessInput / 100,
		forceDistortion: forceDistortionInput
  }

	console.log("%cSettings submitted:", consoleTheme.primary);
	console.log(settings);

	console.log("%cRecipe submitted:", consoleTheme.primary);
	console.log(recipe);

	return { settings, recipe };

}