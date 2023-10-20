/* System */            import * as consoleTheme from "../../console-theme";

/* Types */             import { UIBlock, UIContainer, UIFormComponent } from "../system/types";
/* Components */        import { Button } from "../components/button/button";
import { TextField } from "../components/textfield/textfield";
import { Checkbox } from "../components/checkbox/checkbox";


export class UserInput extends UIBlock {

  constructor(nodes?: { [ key: string ]: UIContainer | UIFormComponent | Button }) {

    if (nodes)
      super(nodes);

    else
      super();

  }


  // Adds an input child.
  addInputComponent(nodes: { [ key: string ]: UIContainer | UIFormComponent | Button }): void {

    this.addChildren(nodes);
    
  }


  // Gets all input from children form components.
  getAllInput(): { [ key: string ]: any } {

    // Set up the result.
    let formInput: { [ key: string ]: any } = { };
    
    // Loop through ValidNodes.
    let nodeNames = Object.keys(this.children);
    for (let name of nodeNames) {

      let child = this.children[name];
      if (child instanceof UIFormComponent)
        formInput[name] = child.getInput();

    }

    return formInput;

  }


  // Clears all input.
  clearAllInput(): void {

    // Loop through children.
    let nodeNames = Object.keys(this.children);
    for (let name of nodeNames) {

      let child = this.children[name];
      if (child instanceof TextField)
        child.setInput("");

      else if (child instanceof Checkbox)
        child.uncheck();

    }

  }


  // Disables all input.
  disableAllInput(): void {

    // Loop through children.
    let nodeNames = Object.keys(this.children);
    for (let name of nodeNames) {

      let child = this.children[name];
      if (child instanceof UIFormComponent)
        child.disable();

    }

  }


  // Enables all input.
  enableAllInput(): void {

    // Loop through children.
    let nodeNames = Object.keys(this.children);
    for (let name of nodeNames) {

      let child = this.children[name];
      if (child instanceof UIFormComponent)
        child.enable();

    }

  }

}