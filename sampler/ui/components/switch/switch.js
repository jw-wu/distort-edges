import { UIFormComponent } from "../../basic-types/component-form.js";

export class Switch extends UIFormComponent {

  constructor({
    variant /* "contained" | "outlined" */,
    size /* "small" | "medium" | "large" */,
    color /* "primary" | "secondary" | "tertiary" */,
    state /* "on" | "off" */,
    label /* string */,
    callbacks /* Function[] */,

    removeBottomBorder /* boolean */
  } = {}) {

    super();


    // Component div.
    this.component.classList.add("switch", variant, size, color);
    if (!removeBottomBorder)
      this.component.classList.add("border-bottom");


    // Container.
    this.container = document.createElement("label");



    // Label.
    if (label) {

      this.label = document.createElement("div");
      this.label.classList.add("label-text");
      this.label.textContent = label;

    }


    // Input.
    this.input = document.createElement("input");
    this.input.type = "checkbox";


    // Slider.
    let slider = document.createElement("div");
    slider.classList.add("slider");

    let handle = document.createElement("div");
    handle.classList.add("handle");

    slider.appendChild(handle);


    // Append.
    this.container.appendChild(this.input);
    this.container.appendChild(slider);
    if (this.label)
      this.component.appendChild(this.label);
    this.component.appendChild(this.container);


    // Listeners.
    this.getInput = this._getInput;

    if (callbacks)
      this.container.addEventListener("click", (e) => {
        for (let callback of callbacks) {
          callback(e);
        }
      });

    
    // Set the state.
    if (state === "on")
      this.toggleOn();

  }


  // Get input.
  _getInput() /* boolean */ {

    return this.input.checked;

  }


  // Toggles the switch.
  toggleOn() {

    this.input.checked = true;

  }


  toggleOff() {

    this.input.checked = false;

  }

}