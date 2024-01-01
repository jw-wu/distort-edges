/* System */
import * as typings from "../../../../library/figma/system/typegroups";

/* Engine */
import { DistortEdgesRecipe } from "../../engine/distortion/recipe";
import DistortedShape from "../../engine/main";

/* Plugins */
import { ExtendedVectorNodeModelSettings } from "../../../../plugins/figma/vectornode-model-extended";
import * as svgPlugin from "../../../../plugins/figma/svg";



export async function apply(node: typings.ShapeNode, settings: ExtendedVectorNodeModelSettings, recipe: DistortEdgesRecipe): Promise<FrameNode> {
  

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