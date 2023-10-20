/* Types */           import { UIToPluginMessage } from "./typegroups";


// Class for storing quick action parameters for each module.
export class OperationModule {

  protected command: string; // Key for referral in code.
  readonly hasUI: boolean; // Whether the module has a UI.
  protected userParameters: { [ key: string ]: string[] }; // Allowed parameters for quick action taskbar.
  readonly isAsync: boolean; // Whether the function is async.
  protected fn: Function; // Function to run for starting operation.
  protected uiCommands: Function; // Function to parse UI messages.


  constructor(command: string, hasUI: boolean, fn: Function, uiCommands?: Function) {

    this.command = command;
    this.hasUI = hasUI;
    this.userParameters = { };

    const AsyncFunction = (async () => {}).constructor;
    this.isAsync = fn instanceof AsyncFunction;
    this.fn = fn;

    if (hasUI && !uiCommands)
      console.log("Module should have UI but does not have any means to parse input from the UI.");

    this.uiCommands = uiCommands ?? (() => { });

  }


  /*********************************************
  Methods for setting up quick action parameters.
  *********************************************/

  // Set parameters.
  setParameterSuggestion(key: string, parameterSuggestion: string): void {

    if (this.userParameters[key]) this.userParameters[key].push(parameterSuggestion);
    else this.userParameters[key] = [ parameterSuggestion ];

  }


  /*********************************************
  Methods for retrieving quick action parameters.
  *********************************************/

  // Get command.
  getCommand(): string {

    return this.command;

  }


  // Check if parameter exists.
  parameterExists(key: string, parameter: string): boolean {

    if (this.userParameters[key].indexOf(parameter) >= 0) return true;
    else return false;

  }


  // Retrieves a list of suggested parameters.
  getParameterSuggestions(key: string): string[] {

    return this.userParameters[key] || [];

  }


  async run(parameters?: ParameterValues): Promise<unknown> {

    let userInput = parameters || { };
    
    if (this.isAsync) return await this.fn(userInput);
    else return this.fn(userInput);

  }

  parseUICommands(message: UIToPluginMessage): void {

    this.uiCommands(message);

  }

}


export class ModuleLibrary {

  protected modules: Map<string, OperationModule>;


  constructor() {

    this.modules = new Map();

  }


  loadModule(module: OperationModule): void {
    
    this.modules.set(module.getCommand(), module);
  
  }

  matchCommandToModule(command: string): OperationModule | null {
    
    let selectedModule = this.modules.get(command);
    if (selectedModule!) return selectedModule;
    else return null;

  }

  moduleCount(): number {

    return this.modules.size;

  }

  runSoloModule(): void {

    this.modules.values().next().value.run();

  }

}


// Load module data for displaying in the quick action taskbar.
export function load(modules: OperationModule[]): ModuleLibrary | null {

  let library = new ModuleLibrary;
  
  if (modules.length > 0) {

    for (let module of modules) {
      library.loadModule(module);
      console.log(`%cModule loaded: ${module.getCommand()}`, "color: #ccc");
    }

    return library;

  }

  else {

    return null;

  }

}