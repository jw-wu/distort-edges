/* System */          import * as consoleTheme from "../../library/console-theme";
                      import * as typings from "../../library/figma/system/typegroups";


export function createNewVariables(
  collectionName: string,
  modeName: string,
  variables: { [ key: string ]: VariableValue }
): { newCollectionCreated: boolean, variablesCreated: number } {

  console.log("%cVariables worker started. Received input:", consoleTheme.primary);
  console.log(`%cCollection name: ${collectionName}`, consoleTheme.secondary);
  console.log(`%cMode name: ${modeName}`, consoleTheme.secondary);
  console.log(`%cVariables:`, consoleTheme.secondary);
  console.log(variables);
  console.log("%c———————————————————————————————", consoleTheme.primary);


  // Find the collection or create a collection if no existing collection is found.
  let collectionResults = getOrCreateCollection(collectionName),
      collection = collectionResults.collection,
      newCollectionCreated = collectionResults.newCollectionCreated;

      
  // Find the mode or create a mode if no existing mode is found.
  let modeId = getOrCreateMode(collection, modeName);


  // Create new variables or update existing ones.
  let variablesCreated = 0;
  if (modeId)
    variablesCreated = updateOrCreateVariables(collection, modeId, variables);

  return { newCollectionCreated: newCollectionCreated, variablesCreated: variablesCreated };

}


function getOrCreateCollection(collectionName: string): { collection: VariableCollection, newCollectionCreated: boolean } {

  // Find collection.
  let allCollections = figma.variables.getLocalVariableCollections(),
      targetCollection: VariableCollection | undefined,
      newCollectionCreated = false;

  for (let collection of allCollections) {

    let nameRegexCaseInsensitive = new RegExp(`^${collectionName}$`, "i");

    // If a collection is found with the name, store it as targetCollection.
    if (collection.name.match(nameRegexCaseInsensitive)) {
      
      // Identifies collections with the same name in a different case.
      if (targetCollection)
        console.log("More than 1 collection exists with the same name (case insensitive).");

      else
        targetCollection = collection;

    }
  }

  // If no collection is found, create a new collection.
  if (!targetCollection) {

    targetCollection = figma.variables.createVariableCollection(collectionName);
    newCollectionCreated = true;

  }

  return { collection: targetCollection, newCollectionCreated: newCollectionCreated };

}


function getOrCreateMode(collection: VariableCollection, modeName: string): string | null {

  // Get the mode if it exists.
  let modeId = "";

  console.log("%cExisting modes found.", consoleTheme.primary);
  console.log(collection.modes);

  for (let mode of collection.modes) {
    if (mode.name === modeName) {

      // Identifies collections with the same name in a different case.
      if (modeId.length > 0)
        console.log("More than 1 collection exists with the same name.");

      else
        modeId = mode.modeId;

    }
  }

  // If no modes with the breakpoint name exists, create one.
  if (modeId.length === 0) {

    // When a new collection is created, a hidden mode is created with the name "Mode 1".
    if (collection.modes.length === 1 && collection.modes[0].name === "Mode 1") {

      modeId = collection.modes[0].modeId;
      collection.renameMode(modeId, modeName);

    }

    else {

      // Else create a new mode.
      try {

        modeId = collection.addMode(modeName);
        collection.renameMode(modeId, modeName);

      }

      catch(error) {

        console.log(`%c${error}`, consoleTheme.error);
        figma.notify("Unfortunately your Figma plan does not support any more modes.", { error: true, timeout: 5000 });
        return null;

      }

    }
  }

  return modeId;
  
}


function updateOrCreateVariables(collection: VariableCollection, modeId: string, variablesToAdd: { [ key: string ]: VariableValue }): number {

  // Set up a counter for variables created.
  let variablesCreated = 0;


  // Create a library for the collection organised by variable names.
  let collectionLibrary: { [ key: string ]: Variable } = { },
      allVariableIds = collection.variableIds;        
      
  for (let variableId of allVariableIds) {

    let variable = figma.variables.getVariableById(variableId);
    if (variable!)
      collectionLibrary[variable.name] = variable;

  }

  // Find variables and store value for the mode, and if none exist, create one.
  let existingVariableNames = Object.keys(collectionLibrary),
      userVariableNames = Object.keys(variablesToAdd),
      userVariableCount = userVariableNames.length;

  // Loop through the variables that the user wants created.
  for (let variableCount = 0; variableCount < userVariableCount; ++variableCount) {

    let userVariableName = userVariableNames[variableCount],
        variable: Variable;

    // If variable does not exists, create one.
    let variableNameIndex = existingVariableNames.indexOf(userVariableName);

    if (variableNameIndex < 0) {

      // Sets the ResolvedType of the variable according to the type of the variable.
      let resolvedType: VariableResolvedDataType = "COLOR";
      
      if (typeof variablesToAdd[userVariableName] === "number")
        resolvedType = "FLOAT";

      else if (typeof variablesToAdd[userVariableName] === "string")
        resolvedType = "STRING";

      else if (typeof variablesToAdd[userVariableName] === "boolean")
        resolvedType = "BOOLEAN";

      else if (typings.isRGB(variablesToAdd[userVariableName]) && typings.isRGBA(variablesToAdd[userVariableName]))
        resolvedType = "COLOR"

      variable = figma.variables.createVariable(userVariableName, collection.id, resolvedType);
    }

    else
      variable = collectionLibrary[existingVariableNames[variableNameIndex]];

    ++variablesCreated;

    variable.setValueForMode(modeId, variablesToAdd[userVariableName]);

  }

  console.log(`%c${userVariableCount} variables created.`, consoleTheme.primary);
  console.log("%c———————————————————————————————", consoleTheme.primary);

  return variablesCreated;

}




export function getCollectionByName(collectionName: string): VariableCollection | null {

  let allCollections = figma.variables.getLocalVariableCollections();
  for (let collection of allCollections) {
    
    if (collection.name === collectionName)
      return collection

  }

  return null;

}




export class VariableCollectionTable {

  readonly id: string = "";
  protected variables: {

    [ variableName: string ]: {
      id: string;
      entries: {
        [ modeName: string ]: {
          modeId: string;
          value: string | number | boolean | RGB | VariableAlias;
        }
      }
    }
  } = { };


  constructor(collectionName: string) {

    // Retrieve the collection.
    const collection = this._getCollection(collectionName);

    if (collection) {

      this.id = collection.id;

      // Get modes in the collection.
      const modes = this._getModes(collection);

      // Store all variables in the class.
      this._storeVariables(collection, modes);
      
    }

    else
      console.log(`%c${collectionName} not found in collections.`, consoleTheme.error);
  }


  private _getCollection(collectionName: string): VariableCollection | null {

    let allCollections = figma.variables.getLocalVariableCollections();

    for (let collection of allCollections) {
      
      if (collection.name === collectionName)
        return collection;

    }

    return null;

  }
  

  private _getModes(collection: VariableCollection): { [ modeName: string ]: string } {

    let modes = collection.modes,
        results: { [ key: string ]: string } = { };

    for (let mode of modes) {

      results[mode.name] = mode.modeId;

    }

    return results;

  }


  private _storeVariables(collection: VariableCollection, modes: { [ modeName: string ]: string }): void {

    // Get all mode names.
    const allModeNames = Object.keys(modes);

    // Get all variable IDs so that we can loop through and store each one in the table.
    const allVariableIds = collection.variableIds;

    for (let variableId of allVariableIds) {

      const variable = figma.variables.getVariableById(variableId);
      if (variable) {

        let values = variable.valuesByMode;

        // Store the data in a format similar to the figma UI.
        this.variables[variable.name] = {
          id: variable.id,
          entries: { }
        };
        
        // Loop through the mode names to store the data.
        for (let modeName of allModeNames) {

          this.variables[variable.name].entries[modeName] = {
            modeId: modes[modeName],
            value: values[modes[modeName]]
          }

        }
      }
    }

  }


  // For debugging.
  printToConsole(): void {

    console.log(this.variables);

  }


  // Refreshes the table, if the collection is updated.
  refresh(): void {

    // Retrieve the collection.
    const collection = figma.variables.getVariableCollectionById(this.id);

    if (collection) {

      // Get modes in the collection.
      const modes = this._getModes(collection);

      // Clears the current variables.
      this.variables = { };

      // Store all variables in the class.
      this._storeVariables(collection, modes);

    }

  }


  // Returns the id of the variable based on the name.
  getVariableId(variableName: string): string | null {

    const variable = this.variables[variableName];
    return variable ? variable.id : null;

  }


  // Get all variables from only one mode.
  getAllVariablesInMode(modeName: string)
    : { [ variableName: string ]: string | number | boolean | RGB | VariableAlias } {

    let output: { [ variableName: string ]: string | number | boolean | RGB | VariableAlias } = { };

    const allVariableNames = Object.keys(this.variables);
    for (let variableName of allVariableNames) {

      let variable = this.variables[variableName];
      output[variableName] = variable.entries[modeName].value;

    }

    return output;

  }


  // Get variable values based on a criterion, from a mode.
  getVariableValuesInModeWithPartialName(modeName: string, partialName: string | RegExp)
    : { [ variableName: string ]: string | number | boolean | RGB | VariableAlias } {

    let output: { [ variableName: string ]: string | number | boolean | RGB | VariableAlias } = { };

    const allVariableNames = Object.keys(this.variables);
    for (let variableName of allVariableNames) {

      let variableMatched = false;

      if (typeof partialName === "string" && variableName.includes(partialName))
        variableMatched = true;

      else if (partialName instanceof RegExp && partialName.test(variableName))
        variableMatched = true;

      // If variable is matched, store it in output.
      if (variableMatched) {

        let variable = this.variables[variableName];
        output[variableName] = variable.entries[modeName].value;

      }

    }

    return output;

  }


  // Get variable ids based on a criterion, from a mode.
  getVariableIdsWithPartialName(partialName: string | RegExp)
  : { [ variableName: string ]: string } {

  let output: { [ variableName: string ]: string } = { };

  const allVariableNames = Object.keys(this.variables);
  for (let variableName of allVariableNames) {

    let variableMatched = false;

    if (typeof partialName === "string" && variableName.includes(partialName))
      variableMatched = true;

    else if (partialName instanceof RegExp && partialName.test(variableName))
      variableMatched = true;

    // If variable is matched, store it in output.
    if (variableMatched) {

      let variable = this.variables[variableName];
      output[variableName] = variable.id;

    }

  }

  return output;

}


  // Get a particluar variable from a mode.
  getValueOfVariableInMode(modeName: string, variableName: string)
    : string | number | boolean | RGB | VariableAlias {

    let allVariables = this.getAllVariablesInMode(modeName);
    return allVariables[variableName];

  }


  // Get all existing mode names.
  getModeNames(): string[] {

    let allVariableNames = Object.keys(this.variables),
        exampleVariable = this.variables[allVariableNames[0]];
    return Object.keys(exampleVariable.entries);

  }

  
  getModeNamesWithIds(): { [ modeName: string ]: string } {

    const allVariableNames = Object.keys(this.variables);

    if (allVariableNames.length > 0) {

      let exampleVariable = this.variables[allVariableNames[0]],
          allModeNames = Object.keys(exampleVariable.entries);

      let output: { [ modeName: string ]: string } = { };

      for (let modeName of allModeNames) {
        output[modeName] = exampleVariable.entries[modeName].modeId;
      }

      return output;

    }

    return { };

  }

}