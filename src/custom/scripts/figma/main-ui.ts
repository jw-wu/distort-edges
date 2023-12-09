/* System */
import * as consoleTheme from "../../../library/console-theme";
import * as typings from "../../../library/figma/system/typegroups";

/* UI */
import * as core from "../../../library/ui/system/core";

/* Blocks */
import { UserInput } from "../../../library/ui/blocks/userinput";

/* Components */
import { UIContainer } from "../../../library/ui/system/types";
import { Button } from "../../../library/ui/components/button/button";
import { Checkbox } from "../../../library/ui/components/checkbox/checkbox";
import { TextField } from "../../../library/ui/components/textfield/textfield";
import { Switch } from "../../../library/ui/components/switch/switch";

/* Engine */
import { DistortEdgesRecipe } from "../engine/distortion-recipe";



let ui = new core.UI({ width: 320, additionalHeight: 104 });



let variableDistortionDistance = new Switch({ 		variant: "contained",
																									size: "medium",
																									color: "primary",
																									state: "on",
																									label: "Variable distortion distance"
});


let maxDistortionDistance = new TextField({  			label: "Maximum distortion distance",
																									inputType: "positiveNumber",
																									size: "large",
																									suffixLabel: "px"
});


let variableDistanceBetweenPoints = new Switch({  variant: "contained",
																									size: "medium",
																									color: "primary",
																									state: "off",
																									label: "Variable distances between points",
																									callbacks: [ toggleUniformDistances ],
																									removeBottomBorder: true
});


let distanceBetweenPoints = new TextField({   		label: "Distance between points",
																									inputType: "positiveNumber",
																									size: "large",
																									suffixLabel: "px"
});


let minDistanceBetweenPoints = new TextField({   	label: "Minimum distance between points",
																									inputType: "positiveNumber",
																									size: "large",
																									suffixLabel: "px"
});
minDistanceBetweenPoints.node().style.display = "none";


let maxDistanceBetweenPoints = new TextField({   	label: "Maximum distance between points",
																									inputType: "positiveNumber",
																									size: "large",
																									suffixLabel: "px"
});
maxDistanceBetweenPoints.node().style.display = "none";


let peakRoundness = new TextField({       				label: "Peak roundness",
																									inputType: "positiveNumber",
																									size: "large",
																									suffixLabel: "%"
});


let troughRoundness = new TextField({     				label: "Trough roundness",
																									inputType: "positiveNumber",
																									size: "large",
																									suffixLabel: "%"
});


let keepLayerDimensions = new Switch({    				variant: "contained",
																									size: "medium",
																									color: "primary",
																									state: "off",
																									label: "Keep layer dimensions"
});


let form = new UserInput({                				variableDistortionDistance,
																									maxDistortionDistance,
																									variableDistanceBetweenPoints,
																									distanceBetweenPoints,
																									minDistanceBetweenPoints,
																									maxDistanceBetweenPoints,
																									peakRoundness,
																									troughRoundness,
																									keepLayerDimensions
});




let startButton = new Button({            				variant: "contained",
																									color: "primary",
																									size: "medium",
																									label: "Distort edges",
																									callback: runPlugin,
																									fit: "fill"
});


let ctaBlock = new UIContainer({          				nodes:  { startButton
																													},
																									defaultPadding: true
});
ctaBlock.node().style.width = "100%";
ctaBlock.node().style.position = "absolute";
ctaBlock.node().style.bottom = "0";


ui.append([                               				form,
                                          				ctaBlock
]);


core.fromPlugin((message: typings.pluginToUIMessage) => {

	switch (message.command) {

		case "loadPropertiesOntoUI":

			const recipe = message.args.recipe;


			if (recipe.variableDistortionDistance)
				variableDistortionDistance.toggleOn();

			else
				variableDistortionDistance.toggleOff();

			maxDistortionDistance.setInput(String(recipe.maximumDistortionDistance));


			if (!recipe.variableDistanceApart) {

				variableDistanceBetweenPoints.toggleOff();
				toggleUniformDistances();

				if (recipe.distanceApart === 0 || !recipe.distanceApart)
					distanceBetweenPoints.setInput("");

				else
					distanceBetweenPoints.setInput(String(recipe.distanceApart));

			}

			else {

				variableDistanceBetweenPoints.toggleOn();
				toggleUniformDistances();

				if (recipe.minDistanceApart === 0 || !recipe.minDistanceApart)
					minDistanceBetweenPoints.setInput("");

				else
					minDistanceBetweenPoints.setInput(String(recipe.minDistanceApart));

				if (recipe.maxDistanceApart === 0 || !recipe.maxDistanceApart)
					maxDistanceBetweenPoints.setInput("");

				else
					maxDistanceBetweenPoints.setInput(String(recipe.maxDistanceApart));

			}


			peakRoundness.setInput(String(recipe.handleDistancePeak * 100));
			troughRoundness.setInput(String(recipe.handleDistanceTrough * 100));

			break;

	}

})


function toggleUniformDistances(): void {

	if (variableDistanceBetweenPoints.getInput()) {

		distanceBetweenPoints.node().style.display = "none";
		minDistanceBetweenPoints.node().style.display = "flex";
		maxDistanceBetweenPoints.node().style.display = "flex";
		ui.resize({ width: "nochange", height: "dom" });

	}

	else {

		minDistanceBetweenPoints.node().style.display = "none";
		maxDistanceBetweenPoints.node().style.display = "none";
		distanceBetweenPoints.node().style.display = "flex";
		ui.resize({ width: "nochange", height: "dom" });

	}

}


function runPlugin(): void {

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



	const recipe: DistortEdgesRecipe = {
		variableDistortionDistance: variableDistortionDistanceInput,
    maximumDistortionDistance: maxDistortionDistanceInput,
		variableDistanceApart: variableDistanceBetweenPointsInput,
    distanceApart: distanceBetweenPointsInput,
		minDistanceApart: minDistanceBetweenPointsInput,
		maxDistanceApart: maxDistanceBetweenPointsInput,
    handleDistancePeak: peakRoundnessInput / 100,
    handleDistanceTrough: troughRoundnessInput / 100,
		keepWithinOriginalSize: keepLayerDimensionsInput,
  }

	console.log("%cRecipe submitted:", consoleTheme.primary);
	console.log(recipe);

	core.toPlugin({ command: "runPlugin", args: { recipe } });

}