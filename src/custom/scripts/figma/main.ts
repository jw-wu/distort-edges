/* System */
import * as typings from "../../../library/figma/system/typegroups";
import { OperationModule } from "../../../library/figma/system/modules";

/* Engine */
import { DistortEdgesRecipe } from "../engine/distortion/recipe";

/* Plugins */
import { ExtendedVectorNodeModelSettings } from "../../../plugins/figma/vectornode-model-extended";

/* App */
import { apply } from "./app/apply-distortion";
import { update } from "./app/update-distortion";
import { getSaveData } from "./app/get-savedata";



export const runDistortEdges = new OperationModule("runDistortEdges", true, () => {

  figma.showUI(__html__, { themeColors: true });

  figma.on("selectionchange", getSaveData);

}, async (message: typings.UIToPluginMessage) => {

  switch(message.command) {

    case "runPlugin":
      await runPlugin(message.args.settings, message.args.recipe);
      break;

  }

});



// Distort.
async function runPlugin(settings: ExtendedVectorNodeModelSettings, recipe: DistortEdgesRecipe): Promise<void> {

  // Get selection.
  const selection = figma.currentPage.selection;

  if (selection.length !== 0) {

    // Set up a new selection for distorted nodes.
    let newSelection: (FrameNode | VectorNode)[] = [ ];

    for (let node of selection) {

      // If the boundingBox of an existing distorted node is selected.
      if (node.type === "FRAME" && node.getPluginData("enclosedNode").length > 0) {

        let distortedNode = node.findOne((n) => n.id === node.getPluginData("enclosedNode"));
        if (distortedNode && distortedNode.type === "VECTOR" && distortedNode.getPluginData("svgCode").length > 0) {

          update(distortedNode, settings, recipe);
          newSelection.push(node);

        }

      }

      // If the distortedShape is selected.
      if (node.type === "VECTOR" && node.getPluginData("svgCode").length > 0) {

        update(node, settings, recipe);
        newSelection.push(node);

      }

      // If a new shape is selected.
      else if (typings.isShapeNode(node))
        newSelection.push(await apply(node, settings, recipe));

    }

    if (newSelection.length === 0)
      figma.notify("No valid layers detected!", { timeout: 3000 });
    
    else {

      figma.currentPage.selection = newSelection;

      if (newSelection.length === 1) {

        figma.notify("Layer distorted.", { timeout: 3000 });
        figma.ui.postMessage({ command: "updateUI", args: { settings, recipe } });

      }

      else {

        figma.notify("Layers distorted.", { timeout: 3000 });
        figma.ui.postMessage({ command: "clearUI", args: {} });

      }

    }

  }

  else
    figma.notify("No selection detected!", { timeout: 3000 });

}