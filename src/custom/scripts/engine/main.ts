/* Engine */
import { DistortEdgesRecipe } from "./distortion/recipe";
import * as startingPoint from "./distortion/starting-point";
import * as edges from "./distortion/edges";
import * as util from "./settings/utility";

/* Plugins */
import { DistortedNodeModel, ExtendedVectorNodeModelSettings, logSettingsErrors, DistortedNodeCenter, PreviousSubpoint } from "../../../plugins/figma/vectornode-model-extended";
import * as svgPlugin from "../../../plugins/figma/svg";



export default class DistortedShape {

  protected model: DistortedNodeModel;
  protected settings: ExtendedVectorNodeModelSettings;
  protected recipe: DistortEdgesRecipe | undefined;

  constructor(input: string, shapeSettings: ExtendedVectorNodeModelSettings, distortionRecipe?: DistortEdgesRecipe) {

    if (typeof input !== "string")
      console.error("Parameter \"input\" needs to be a string when creating a new DistortedNode object.");

    logSettingsErrors(shapeSettings);

    util.debugLog("Received settings:");
    util.debugLog(shapeSettings);

    // Simplify SVG Path d value into M, L, C, Q, and Z commands. Simplified commands are compatible with Figma's vector path type.
    input = (input.includes("<svg")) ?
      svgPlugin.svgToVectorPath(input) :
      svgPlugin.simplifySvgD(input);

    this.settings = shapeSettings;
    this.model = new DistortedNodeModel(input, shapeSettings);

    if (distortionRecipe)
      this.recipe = distortionRecipe;

  }


  getDrawCommands(distortionRecipe?: DistortEdgesRecipe): string {

    if (distortionRecipe)
      return this._distortEdges(distortionRecipe).path;

    else if (this.recipe)
      return this._distortEdges(this.recipe).path;

    else
      return "";

  }


  getAll(distortionRecipe?: DistortEdgesRecipe): { path: string, center: Vector } {

    if (distortionRecipe)
      return this._distortEdges(distortionRecipe);

    else if (this.recipe)
      return this._distortEdges(this.recipe);

    else
      return { path: "", center: { x: 0, y: 0 } };

  }


  private _distortEdges(recipe: DistortEdgesRecipe): { path: string, center: Vector } {

    util.debugLog("Starting distortedges.distortEdges()", util.consoleColor.inProgress);

    // Sets up new variables for new d path and center coords.
    let output = "",
        center = new DistortedNodeCenter(this.model.getBoundingBox().width, this.model.getBoundingBox().height);


    // Sets up a storage for the last subpoint calculated.
    let previousSubpoint: PreviousSubpoint = {
      coords: { x: NaN, y: NaN },
      handleAngle: NaN
    };


    // Gets the distorted path.
    for (let i = 0; i < this.model.size(); ++i) {

      const vectorCommand = this.model.getCommand(i);

      switch(vectorCommand.type) {

        case "M":

          const startingPointOutput = startingPoint.create(this.model, vectorCommand, recipe);

          if (startingPointOutput) {

            output = (output.length === 0) ? `${startingPointOutput.path}` : `${output} ${startingPointOutput.path}`;
            previousSubpoint = startingPointOutput.previousSubpoint;

          }

          else
            console.error("Starting point could not be created.");

          break;


        case "L":
        case "C":

          const distortionOutput = edges.distort(this.model, vectorCommand, recipe, center, previousSubpoint);
          output = `${output} ${distortionOutput.path}`;
          previousSubpoint = distortionOutput.previousSubpoint;

          break;


        case "Z":
          
          output = `${output} Z`;

          break;
      }
    }


    const returnValue = { path: output, center: center.getCoords() };

    util.debugLog("Completed distortedges.distortEdges()", util.consoleColor.success);
    util.debugLog(returnValue);

    return returnValue;

  }

}