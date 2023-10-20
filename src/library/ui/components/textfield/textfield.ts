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



export class TextField extends uiTypings.UIFormComponent {

  protected inputTitle: HTMLDivElement;
  protected inputLabel: HTMLDivElement;
  protected removeButton: HTMLDivElement | undefined;

  protected primaryContent: HTMLDivElement;
  protected prefixVariant: "color" | "icon" | "text" | "none";
  protected prefix: HTMLDivElement | undefined;
  protected input: HTMLInputElement;

  protected suffixLabel: HTMLDivElement | undefined;
  
    
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

      super();

      this.prefixVariant = "none";



      // Component div.
      this.component.classList.add("component", "textfield");

      if (theme.isSizeVariant(settings.size))
        this.component.classList.add(settings.size);

      else
        this.component.style.padding = settings.size.padding;

      if (!settings.removeBottomBorder)
        this.component.classList.add("border-bottom");



      // Input title, containing the label and the remove button.
      this.inputTitle = document.createElement("div");
      this.inputTitle.classList.add("input-title");

      // Input label.
      this.inputLabel = document.createElement("div");
      this.inputLabel.classList.add("label");
      this.inputLabel.textContent = settings.label;

      // Append.
      this.inputTitle.appendChild(this.inputLabel);
      this.component.appendChild(this.inputTitle);



      // Primary content area.
      this.primaryContent = document.createElement("div");
      this.primaryContent.classList.add("primary-content");
      
      // Color swatch prefix.
      if (settings.prefix?.variant === "color") {

        this.prefixVariant = "color";
        this._createSwatch(settings.prefix.property);

      }

      // Input field.
      let inputArea = document.createElement("div");
      inputArea.classList.add("input-area");

      this.input = document.createElement("input");
      this.input.type = settings.inputType;

      if (!theme.isSizeVariant(settings.size))
        this.input.style.fontSize = settings.size.inputTextSize;
      
      if (settings.placeholder)
        this.input.placeholder = settings.placeholder;

      if (settings.defaultText)
        this.input.value = settings.defaultText;

      if (this.prefixVariant === "color")
        this.input.addEventListener("keyup", (e) => { this.setSwatch(this.getInput().trim()); });

      if (settings.callbacksOnAnyKeyPress)
        this.input.addEventListener("keypress", (e) => { 
          for (let callback of settings.callbacksOnAnyKeyPress!) {
            callback(e);
          }
        });

      if (settings.callbacksOnAnyKeyUp)
        this.input.addEventListener("keyup", (e) => { 
          for (let callback of settings.callbacksOnAnyKeyUp!) {
            callback(e);
          }
        });

      // Suffix label.
      if (settings.suffixLabel)
        this._createSuffixLabel(settings.suffixLabel);

      // Append.
      inputArea.appendChild(this.input);

      if (this.suffixLabel!)
        inputArea.appendChild(this.suffixLabel);

      if (this.prefix)
        this.primaryContent.appendChild(this.prefix);

      this.primaryContent.appendChild(inputArea);
      this.component.appendChild(this.primaryContent);



      // Helper/error text.
      this.helperText.classList.add("helpertext", "hidden");

      // Append.
      this.component.appendChild(this.helperText);



      // Set up input retrieval.
      this.getInput = (): string => {
        return this.input.value;
      };


      // Listeners.
      if (settings.inputType === "integer")
        this.input.addEventListener("keypress", validation.validateInteger);

    }


    private _createSwatch(color?: string): void {

      this.prefix = document.createElement("div");
      this.prefix.classList.add("swatch");

      if (color)
        this.prefix.style.backgroundColor = color;
      
      else
        this.prefix.style.backgroundColor = "#222";

    }


    private _createSuffixLabel(suffixLabel: string): void {

      this.suffixLabel = document.createElement("div");
      this.suffixLabel.classList.add("suffix-label");
      this.suffixLabel.textContent = suffixLabel;

    }



    // Helper text
    setHelperText(message: string): void {

      this.helperText.innerText = message;
      this.helperText.classList.remove("hidden");

    }


    clearHelperText(): void {

      this.helperText.classList.add("hidden");
      setTimeout(() => {
        this.helperText.innerText = "";
      }, 50);

    }


    setError(message: string): void {

      this.setHelperText(message);
      this.helperText.classList.remove("hidden");

    }


    clearError(): void {

      this.clearHelperText();
      this.helperText.classList.remove("error");

    }


    disable(): void {

      this.component.classList.add("disabled");

    }


    enable(): void {

      this.component.classList.remove("disabled");

    }


    setInput(input: string): void {

      this.input.value = input;

    }


    setSwatch(hex: string): void {
      
      if (this.prefixVariant === "color" && color.isHex(hex)) {

        hex = color.expandHex(hex);
        this.prefix!.style.backgroundColor = hex;

      }

    }

}