// Updates the UI with save data retrieved from Figma.


/* System */
import * as typings from "../../../../../library/figma/system/typegroups";

/* UI */
import {
  variableDistortionDistance,
  maxDistortionDistance,
  variableDistanceBetweenPoints,
  distanceBetweenPoints,
  minDistanceBetweenPoints,
  maxDistanceBetweenPoints,
  peakRoundness,
  troughRoundness,
  keepLayerDimensions,
  toggleUniformDistances,
  forceDistortion
} from "./../gui";



export function updateUI(message: typings.pluginToUIMessage) {

  const settings = message.args.settings,
        recipe = message.args.recipe;


  // Distortion distance
  if (recipe.variableDistortionDistance)
    variableDistortionDistance.toggleOn();

  else
    variableDistortionDistance.toggleOff();

  maxDistortionDistance.setInput(String(recipe.maximumDistortionDistance));


  // Distance apart
  if (!settings.variableDistanceApart) {

    variableDistanceBetweenPoints.toggleOff();
    toggleUniformDistances();

    if (settings.distanceApart === 0 || !settings.distanceApart)
      distanceBetweenPoints.setInput("");

    else
      distanceBetweenPoints.setInput(String(settings.distanceApart));

  }

  else {

    variableDistanceBetweenPoints.toggleOn();
    toggleUniformDistances();

    if (settings.minDistanceApart === 0 || !settings.minDistanceApart)
      minDistanceBetweenPoints.setInput("");

    else
      minDistanceBetweenPoints.setInput(String(settings.minDistanceApart));

    if (settings.maxDistanceApart === 0 || !settings.maxDistanceApart)
      maxDistanceBetweenPoints.setInput("");

    else
      maxDistanceBetweenPoints.setInput(String(settings.maxDistanceApart));

  }


  // Roundness
  peakRoundness.setInput(String(recipe.handleDistancePeak * 100));
  troughRoundness.setInput(String(recipe.handleDistanceTrough * 100));


  // Keep layer dimensions.
  if (settings.keepWithinOriginalSize)
    keepLayerDimensions.toggleOn();

  else
    keepLayerDimensions.toggleOff();

  
  // Force distortion.
  if (recipe.forceDistortion)
    forceDistortion.toggleOn();

  else
    forceDistortion.toggleOff();

}