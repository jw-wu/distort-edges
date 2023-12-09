/* Engine */
import { DistortEdgesRecipe, logRecipeErrors } from "./distortion-recipe";
import * as startingPoint from "./distortion-startingpoint";
import * as edges from "./distortion-edges";
import * as util from "./utility";

/* Plugins */
import { DistortedNodeModel, ExtendedVectorNodeModelSettings, logSettingsErrors, DistortedNodeCenter, PreviousSubpoint } from "../../../plugins/figma/vectornode-model-extended";
import * as svgPlugin from "../../../plugins/figma/svg";



export default class DistortedShape {

  protected model: DistortedNodeModel;
  protected settings: ExtendedVectorNodeModelSettings;

  constructor(input: string, settings: ExtendedVectorNodeModelSettings) {

    if (typeof input !== "string")
      console.error("Parameter \"input\" needs to be a string when creating a new DistortedNode object.");

    logSettingsErrors(settings);

    util.debugLog("Received recipe:");
    util.debugLog(settings);

    // Simplify SVG Path d value into M, L, C, Q, and Z commands. Simplified commands are compatible with Figma's vector path type.
    input = (input.includes("<svg")) ?
      svgPlugin.svgToVectorPath(input) :
      svgPlugin.simplifySvgD(input);

    this.settings = settings;
    this.model = new DistortedNodeModel(input, settings);

  }


  getDrawCommands(recipe: DistortEdgesRecipe): string {

    return this._distortEdges(recipe).path;

  }


  getAll(recipe: DistortEdgesRecipe): { path: string, center: Vector } {

    return this._distortEdges(recipe);

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