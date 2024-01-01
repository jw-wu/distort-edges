// Get and read the save data from the distorted node or its enclosing frame.



/* System */
import * as typings from "../../../../library/figma/system/typegroups";
import * as consoleTheme from "../../../../library/console-theme";



export function getSaveData(): void {

  const selection = figma.currentPage.selection;

  if (selection.length === 1) {

    if (typings.isShapeNode(selection[0])) {

      const settingsData = selection[0].getPluginData("settings"),
            recipeData = selection[0].getPluginData("recipe");

      if (settingsData.length !== 0 && recipeData.length !== 0)
        readData(settingsData, recipeData);

    }

    else if (selection[0].type === "FRAME") {

      const enclosedNodeId = selection[0].getPluginData("enclosedNode");

      if (enclosedNodeId.length > 0) {

        const distortedNode = selection[0].findOne((n) => n.id === enclosedNodeId);
        if (distortedNode) {

          const settingsData = distortedNode.getPluginData("settings"),
                recipeData = distortedNode.getPluginData("recipe");

          if (recipeData.length !== 0)
            readData(settingsData, recipeData);       

        }

      }

    }

  }

}


function readData(settingsData: string, recipeData: string): void {

  const settings = JSON.parse(settingsData),
        recipe = JSON.parse(recipeData);

  console.log("%cSettings retrieved:", consoleTheme.primary);
  console.log(settings);

  console.log("%cRecipe retrieved:", consoleTheme.primary);
  console.log(recipe);
            
  figma.ui.postMessage({ command: "updateUI", args: { settings, recipe } });

}