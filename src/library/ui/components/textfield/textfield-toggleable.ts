/* UI */
import * as uiTypings from "../../system/types";
import * as theme from "../../../../custom/ui-variants";

/* Components */
import { TextField } from "./textfield";
import { Switch } from "../switch/switch";



export class ToggleableTextField extends TextField {

  protected toggle: Switch;

  constructor(settings: {

    label: string,
    inputType: "text" | "integer" | "number",
    size: theme.Size |
          { padding: string,
            inputTextSize: string },
      
    placeholder?: string,
    defaultText?: string,
    prefix?:  { variant: "color" | "icon" | "text"
                property?: string
              },
    suffixLabel?: string,
    removeBottomBorder?: boolean,

    callbacksOnAnyKeyPress?: Function[],
    callbacksOnAnyKeyUp?: Function[],

  }) {

    super(settings);


    // Component.
    this.component.classList.add("toggleable", "collapsed");


    // Adds a switch to the input title area.
    this.toggle = new Switch({
      variant: "contained",
      size: "small",
      color: "primary",
      state: "off",
      callbacks: [ this.toggleInputArea.bind(this) ]
    });
    this.toggle.node().style.padding = "0";

    this.inputTitle.appendChild(this.toggle.node());


    // Listener.
    this.getInput = this._getInput;

  }


  // Gets the input.
  private _getInput(): string | null {

    if (this.toggle.getInput() === false)
      return null;

    else
      return this.input.value;

  }


  // Toggles input area visible or hidden.
  toggleInputArea(): void {
    
    const inputIsVisible = this.toggle.getInput();

    if (inputIsVisible) {

      if (this.suffixLabel)
        this.suffixLabel.style.transitionDelay = "";
      this.component.classList.add("collapsed");

    }

    else {

      if (this.suffixLabel)
        this.suffixLabel.style.transitionDelay = "0.15s";
      this.component.classList.remove("collapsed");

    }
    
  }


  // Sets input area to visible.
  showInputArea(): void {

    const inputIsVisible = this.toggle.getInput();
    if (!inputIsVisible) {

      this.toggleInputArea();
      this.toggle.toggleOn();

    }

  }


  // Sets input area to hidden.
  hideInputArea(): void {

    const inputIsVisible = this.toggle.getInput();
    if (inputIsVisible) {

      this.toggleInputArea();
      this.toggle.toggleOff();

    }

  }

}