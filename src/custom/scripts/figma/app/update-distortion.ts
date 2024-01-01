/* Engine */
import { DistortEdgesRecipe } from "../../engine/distortion/recipe";
import DistortedShape from "../../engine/main";

/* Plugins */
import { ExtendedVectorNodeModelSettings } from "../../../../plugins/figma/vectornode-model-extended";



export function update(node: VectorNode, settings: ExtendedVectorNodeModelSettings, recipe: DistortEdgesRecipe): void {

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