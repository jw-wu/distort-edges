/* UI */
import * as uiTypings from "../../system/types";
import * as theme from "../../../../custom/ui-variants";
import * as validation from "../../system/validation";

/* UI helpers */
import { icon } from "../../helpers/create-svg";

/* Plugin */
import * as color from "../../../../plugins/general/color";

/* SVG */
import { minusSVG } from "../../res/minus";
import { TextField } from "./textfield";



export class RemovableTextField extends TextField {

  protected removeButton: HTMLDivElement;

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


    // Add class.
    this.component.classList.add("removable");


    // Add remove button.
    this.removeButton = document.createElement("div");
    this.removeButton.classList.add("remove-button");        
    this.removeButton.appendChild( icon(16, minusSVG, "var(--color-primary)") );

    this.removeButton.addEventListener("mousedown", (e) => {
      this.node().remove();
    });

    this.inputTitle.appendChild(this.removeButton);

  }

}