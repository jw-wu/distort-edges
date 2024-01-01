// Main GUI.



/* System */
import * as typings from "../../../../library/figma/system/typegroups";

/* UI */
import * as core from "../../../../library/ui/system/core";

/* Blocks */
import { UserInput } from "../../../../library/ui/blocks/userinput";

/* Components */
import { UIContainer } from "../../../../library/ui/system/types";
import { Button } from "../../../../library/ui/components/button/button";
import { TextField } from "../../../../library/ui/components/textfield/textfield";
import { Switch } from "../../../../library/ui/components/switch/switch";

/* UI processes */
import { getInput } from "./get-input";
import { updateUI } from "./listener/update-ui";



let ui = new core.UI({ width: 320, additionalHeight: 104 });



export let variableDistortionDistance = new Switch({ 		variant: "contained",
																												size: "medium",
																												color: "primary",
																												state: "on",
																												label: "Variable distortion distance"
});


export let maxDistortionDistance = new TextField({  		label: "Maximum distortion offset distance",
																												inputType: "positiveNumber",
																												size: "large",
																												suffixLabel: "px"
});


export let variableDistanceBetweenPoints = new Switch({ variant: "contained",
																												size: "medium",
																												color: "primary",
																												state: "off",
																												label: "Variable distances between points",
																												callbacks: [ toggleUniformDistances ],
																												removeBottomBorder: true
});


export let distanceBetweenPoints = new TextField({   		label: "Distance between points",
																												inputType: "positiveNumber",
																												size: "large",
																												suffixLabel: "px"
});


export let minDistanceBetweenPoints = new TextField({   label: "Minimum distance between points",
																												inputType: "positiveNumber",
																												size: "large",
																												suffixLabel: "px"
});
minDistanceBetweenPoints.node().style.display = "none";


export let maxDistanceBetweenPoints = new TextField({   label: "Maximum distance between points",
																												inputType: "positiveNumber",
																												size: "large",
																												suffixLabel: "px"
});
maxDistanceBetweenPoints.node().style.display = "none";


export let peakRoundness = new TextField({       				label: "Peak roundness",
																												inputType: "positiveNumber",
																												size: "large",
																												suffixLabel: "%"
});


export let troughRoundness = new TextField({     				label: "Trough roundness",
																												inputType: "positiveNumber",
																												size: "large",
																												suffixLabel: "%"
});


export let keepLayerDimensions = new Switch({    				variant: "contained",
																												size: "medium",
																												color: "primary",
																												state: "off",
																												label: "Keep layer dimensions"
});


export let forceDistortion = new Switch({    						variant: "contained",
																												size: "medium",
																												color: "primary",
																												state: "off",
																												label: "Force distortion on small distances"
});


export let form = new UserInput({                				variableDistortionDistance,
																												maxDistortionDistance,
																												variableDistanceBetweenPoints,
																												distanceBetweenPoints,
																												minDistanceBetweenPoints,
																												maxDistanceBetweenPoints,
																												peakRoundness,
																												troughRoundness,
																												keepLayerDimensions,
																												forceDistortion
});




export let startButton = new Button({            				variant: "contained",
																												color: "primary",
																												size: "medium",
																												label: "Distort edges",
																												callback: () => { core.toPlugin({ command: "runPlugin", args: getInput() }) },
																												fit: "fill"
});


export let ctaBlock = new UIContainer({          				nodes:  { startButton
																																},
																												defaultPadding: true
});
ctaBlock.node().style.width = "100%";
ctaBlock.node().style.position = "absolute";
ctaBlock.node().style.bottom = "0";


ui.append([                               							form,
                                          							ctaBlock
]);


core.fromPlugin((message: typings.pluginToUIMessage) => {

	switch (message.command) {

		case "updateUI":
			updateUI(message);
			break;

	}

})


export function toggleUniformDistances(): void {

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