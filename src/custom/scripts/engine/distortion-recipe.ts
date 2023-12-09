export type DistortCorner = "sharp" | "smooth";
export const isDistortCorner = (input: string): input is DistortCorner => (
  input.includes("sharp") ||
  input.includes("smooth")
);


/*  RECIPE 
    offsetDistance                  How large the "spikes" will be, in pixels.
    distanceApart                   Distance between each "spike" in pixels.
    variableDistanceApart           Should the "spikes" be a regular distance from each other?
    roughen                         Should the effect be like Illustrator's "roughen" filter, or uniform in its "spikes" like a zigzag?
    corner                          Smooth / rounded, or sharp?
    keepWithinOriginalSize          Should the distorted result be kept to the same size as the original shape?
    handleDistanceMultiplierPeak    How round should the peaks (top of "spikes") be?
    handleDistanceMultiplierTrough  How round should the valleys (between "spikes") be?
*/

export interface DistortEdgesRecipe {
  variableDistortionDistance: boolean;
  maximumDistortionDistance: number;
  variableDistanceApart: boolean;
  distanceApart?: number;
  minDistanceApart?: number;
  maxDistanceApart?: number;
  handleDistancePeak: number;
  handleDistanceTrough: number;
  keepWithinOriginalSize: boolean;
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