/* UI */
import * as uiTypings from "../../system/types";
import * as theme from "../../../../custom/ui-variants";


export class Switch extends uiTypings.UIFormComponent {

  protected container: HTMLLabelElement;
  protected label: HTMLDivElement | undefined;
  protected input: HTMLInputElement;

  constructor(settings: {
    variant: theme.Variant,
    size: theme.Size,
    color: theme.Color,
    state?: "on" | "off",
    label?: string,
    callbacks?: Function[]
  }) {

    super();


    // Component div.
    this.component.classList.add("component", "switch", settings.variant, settings.size, settings.color);


    // Container.
    this.container = document.createElement("label");



    // Label.
    if (settings.label) {

      this.label = document.createElement("div");
      this.label.textContent = settings.label;

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

    if (settings.callbacks)
      this.component.addEventListener("mousedown", (e) => {
        for (let callback of settings.callbacks!) {
          callback(e);
        }
      });

    
    // Set the state.
    if (settings.state === "on")
      this.toggleOn();

  }


  // Get input.
  private _getInput(): boolean {

    return this.input.checked;

  }


  // Toggles the switch.
  toggleOn(): void {

    this.input.checked = true;

  }


  toggleOff(): void {

    this.input.checked = false;

  }

}