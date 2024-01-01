import { UIComponent } from "./component.js";



// Generic class that all form componenets are extended from.
export class UIFormComponent extends UIComponent {

  constructor() {

    super();

    this.component.classList.add("input-element");

    // Creates a helper text div. The component should add this in the right place or it will not appear.
    this.helperText = document.createElement("div");
    this.helperText.classList.add("helpertext", "hidden");

    this.state = "enabled";

    this.getInput = () => { console.error("No functions defined yet."); };

  }


  // Set the component state to disabled.
  disable() {

    this.component.classList.remove("enabled", "error");
    this.component.classList.add("disabled");

    this.state = "disabled";

  }


  // Set the component state to enabled.
  enable() {

    this.component.classList.remove("disabled", "error");
    this.component.classList.add("enabled");

    this.state = "enabled";

  }


  // Set the component state to error.
  error(message /* string */) {

    this.component.classList.remove("enabled", "disabled");
    this.component.classList.add("error");

    this.state = "error";

    this.helperText.textContent = message;

  }

}