import { UIComponent } from "../../basic-types/component.js";



export class Button extends UIComponent {
  
  constructor({
    variant /* "contained" | "outlined" */,
    color /* "primary" | "secondary" |"tertiary" */,
    size /* "small" | "medium" | "large" */,
    label /* string */,
    callback /* Function */,

    fit /* "fill" | "hug" */
  } = {}) {

    super();

    this.label = document.createElement("div");

    // Component div.
    this.component.classList.add("button", variant, size, "enabled");


    // Color variant.
    this.component.classList.add(color);


    // Fit.
    if (fit)
      this.component.classList.add(fit);


    // Label.
    this.label.classList.add("label");
    this.label.innerText = label;

    
    // Append all.
    this.component.appendChild(this.label);

    this.component.addEventListener("click", (e) => { callback(e); });

    this.state = "enabled";

  }



  error() {
    this.component.classList.remove(this.state);
    this.component.classList.add("error");
    this.state = "error";
  }

  disable() {
    this.component.classList.remove(this.state);
    this.component.classList.add("disabled");
    this.state = "disabled";
  }

  enable() {
    this.component.classList.remove(this.state);
    this.component.classList.add("enabled");
    this.state = "enabled";
  }

}