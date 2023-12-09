/* System */
import * as typings from "../../../library/figma/system/typegroups";
import { OperationModule } from "../../../library/figma/system/modules";

/* Engine */
import { DistortEdgesRecipe } from "../engine/distortion-recipe";
import DistortedShape from "../engine/entry";

/* Plugins */
import { ExtendedVectorNodeModelSettings } from "../../../plugins/figma/vectornode-model-extended";
import * as svgPlugin from "../../../plugins/figma/svg";



export const runDistortEdges = new OperationModule("runDistortEdges", true, () => {

  figma.showUI(__html__, { themeColors: true });

  figma.on("selectionchange", loadPropertiesOntoUI);

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

          updateDistortion(distortedNode, settings, recipe);
          newSelection.push(node);

        }

      }

      // If the distortedShape is selected.
      if (node.type === "VECTOR" && node.getPluginData("svgCode").length > 0) {

        updateDistortion(node, settings, recipe);
        newSelection.push(node);

      }

      // If a new shape is selected.
      else if (typings.isShapeNode(node))
        newSelection.push(await applyDistortion(node, settings, recipe));

    }

    if (newSelection.length === 0)
      figma.notify("No valid layers detected!", { timeout: 3000 });
    
    else {

      figma.currentPage.selection = newSelection;

      if (newSelection.length === 1) {

        figma.notify("Layer distorted.", { timeout: 3000 });
        figma.ui.postMessage({ command: "loadPropertiesOntoUI", args: { recipe } });

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


async function applyDistortion(node: typings.ShapeNode, settings: ExtendedVectorNodeModelSettings, recipe: DistortEdgesRecipe): Promise<FrameNode> {

  // Store the node's current rotation, as it will affect the placement.
  const nodeRotation = node.rotation;
  node.rotation = 0;
  
  
  // Flatten the node to get d commands in SVG.
  const flattenedNode = figma.flatten([ node.clone() ], figma.currentPage);
  
  // Get the vector path data from the SVG commands.
  const savedSvgCode = node.getPluginData("svgCode");
  const svgCode = (savedSvgCode.length === 0) ?
    await svgPlugin.getCode(flattenedNode) :
    savedSvgCode;


  let distortedNode = new DistortedShape(svgCode, settings),
      output = distortedNode.getAll(recipe);


  // Create a frame to contain the result and the original. The frame will define th bouding box.
  let boundingBox = figma.createFrame();

  if (node.parent) {

    let i = node.parent.children.indexOf(node);
    node.parent.insertChild(i + 1, boundingBox);

  }

  boundingBox.x = node.x;
  boundingBox.y = node.y;
  boundingBox.resize(node.width, node.height);
  boundingBox.fills = [];
  boundingBox.clipsContent = false;


  // Create distorted node.
  let distortedShape = figma.createVector();
  boundingBox.appendChild(distortedShape);

  distortedShape.vectorPaths = [{ windingRule: "EVENODD", data: output.path }];
  if (settings.keepWithinOriginalSize) {

    distortedShape.x = 0;
    distortedShape.y = 0;

  }

  else {

    distortedShape.x = (boundingBox.width / 2) - output.center.x;
    distortedShape.y = (boundingBox.height / 2) - output.center.y;

  }

  distortedShape.strokes = node.strokes;
  distortedShape.strokeStyleId = node.strokeStyleId;
  distortedShape.strokeWeight = node.strokeWeight;
  distortedShape.strokeCap = node.strokeCap;
  distortedShape.strokeJoin = node.strokeJoin;
  distortedShape.dashPattern = node.dashPattern;
  distortedShape.strokeMiterLimit = node.strokeMiterLimit;
  distortedShape.fills = node.fills;
  distortedShape.fillStyleId = node.fillStyleId;

  distortedShape.opacity = node.opacity;
  distortedShape.blendMode = node.blendMode;
  distortedShape.effects = node.effects;
  distortedShape.effectStyleId = node.effectStyleId;
  
  distortedShape.name = `${node.name}`;
  boundingBox.name = `${node.name} (Original size)`;
  boundingBox.rotation = nodeRotation;


  // Saves plugin data.
  distortedShape.setPluginData("svgCode", svgCode);
  distortedShape.setPluginData("settings", JSON.stringify(settings));
  distortedShape.setPluginData("recipe", JSON.stringify(recipe));
  distortedShape.setPluginData("boundingBox", JSON.stringify({
    x: boundingBox.x,
    y: boundingBox.y,
    width: boundingBox.width,
    height: boundingBox.height
  }));
  boundingBox.setPluginData("enclosedNode", distortedShape.id);
  

  flattenedNode.remove();

  // Resets the node and hides it.
  node.rotation = nodeRotation;
  node.visible = false;

  return boundingBox;

}


function updateDistortion(node: VectorNode, settings: ExtendedVectorNodeModelSettings, recipe: DistortEdgesRecipe): void {

  const newDistortedNode = new DistortedShape(node.getPluginData("svgCode"), settings),
        updateResult = newDistortedNode.getAll(recipe);


  const vectorPath: VectorPath[] = [ {
    windingRule: node.vectorPaths[0].windingRule,
    data: updateResult.path
  } ];
  node.vectorPaths = vectorPath;


  const boundingBoxPluginData = node.getPluginData("boundingBox");
  if (boundingBoxPluginData) {
    
    const boundingBox = JSON.parse(boundingBoxPluginData);
    if (boundingBox.width && boundingBox.height) {

      node.x = (boundingBox.width / 2) - updateResult.center.x;
      node.y = (boundingBox.height / 2) - updateResult.center.y;

    }
  }


  node.setPluginData("settings", JSON.stringify(settings));
  node.setPluginData("recipe", JSON.stringify(recipe));

}


// Update UI.
function loadPropertiesOntoUI(): void {

  const selection = figma.currentPage.selection;

  if (selection.length === 1) {

    if (typings.isShapeNode(selection[0])) {

      const settingsData = selection[0].getPluginData("settings"),
            recipeData = selection[0].getPluginData("recipe");

      if (settingsData.length !== 0 && recipeData.length !== 0) {

        const settings = JSON.parse(settingsData),
              recipe = JSON.parse(recipeData);
        figma.ui.postMessage({ command: "loadPropertiesOntoUI", args: { settings, recipe } });

      }

    }

    else if (selection[0].type === "FRAME") {

      const enclosedNodeId = selection[0].getPluginData("enclosedNode");

      if (enclosedNodeId.length > 0) {

        const distortedNode = selection[0].findOne((n) => n.id === enclosedNodeId);
        if (distortedNode) {

          const settingsData = distortedNode.getPluginData("settings"),
                recipeData = distortedNode.getPluginData("recipe");

          if (recipeData.length !== 0) {

            const settings = JSON.parse(settingsData),
                  recipe = JSON.parse(recipeData);
            figma.ui.postMessage({ command: "loadPropertiesOntoUI", args: { settings, recipe } });

          }          

        }

      }

    }

  }

}