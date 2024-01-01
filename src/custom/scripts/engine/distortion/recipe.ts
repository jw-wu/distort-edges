export type DistortCorner = "sharp" | "smooth";
export const isDistortCorner = (input: string): input is DistortCorner => (
  input.includes("sharp") ||
  input.includes("smooth")
);

export interface DistortEdgesRecipe {
  variableDistortionDistance: boolean;  // How large the "spikes" will be, in pixels.
  maximumDistortionDistance: number;    // Maximum distance each "spike" will go.
  handleDistancePeak: number;           // How round should the top of "spikes" be?
  handleDistanceTrough: number;         // How round should the valleys between "spikes" be?
  forceDistortion?: boolean;            // Should the sub-segments be distorted even if they are small?
};

export const isDistortEdgesRecipe = (input: any): input is DistortEdgesRecipe => (
  "variableDistortionDistance" in input &&
  "maximumDistortionDistance" in input &&
  "handleDistancePeak" in input &&
  "handleDistanceTrough" in input
);



export function logRecipeErrors(recipe: any) {

  if (typeof recipe.variableDistortionDistance === "undefined")
    console.error("Parameter \"variableDistortionDistance\" missing.");

  else if (typeof recipe.variableDistortionDistance !== "boolean")
    console.error("Parameter \"variableDistortionDistance\" needs to be a boolean.");
  
  if (!recipe.maximumDistortionDistance)
    console.error("Parameter \"maximumDistortionDistance\" missing.");
  
  else if (typeof recipe.maximumDistortionDistance !== "number")
    console.error("Parameter \"maximumDistortionDistance\" needs to be a number.");


  if (typeof recipe.handleDistancePeak === "undefined")
    console.error("Parameter \"handleDistancePeak\" missing.");

  else if (typeof recipe.handleDistancePeak !== "number")
    console.error("Parameter \"handleDistancePeak\" needs to be a number.");

  if (typeof recipe.handleDistanceTrough === "undefined")
    console.error("Parameter \"handleDistanceTrough\" missing.");

  else if (typeof recipe.handleDistanceTrough !== "number")
    console.error("Parameter \"handleDistanceTrough\" needs to be a number.");

}