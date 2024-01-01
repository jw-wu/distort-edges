import { UIFormComponent } from "../../basic-types/component-form.js";
import * as validation from "../../helpers/validation.js";



export class TextField extends UIFormComponent {  
    
  constructor({
    label /* string */,
    inputType /* "text" | "integer" | "number" | "positiveNumber" | "negativeNumber" */,
    size /* "small" | "medium" | "large" */,
    placeholder /* string */,
    suffixLabel /* string */,
      
    callbacksOnAnyKeyPress /* Function[] */,
    callbacksOnAnyKeyUp /* Function[] */
  } = {}) {

      super();


      // Component div.
      this.component.classList.add("textfield");
      this.component.classList.add(size);


      // Input title, containing the label and the remove button.
      this.inputTitle = document.createElement("div");
      this.inputTitle.classList.add("input-title");

      // Input label.
      this.inputLabel = document.createElement("div");
      this.inputLabel.classList.add("label");
      this.inputLabel.textContent = label;

      // Append.
      this.inputTitle.appendChild(this.inputLabel);
      this.component.appendChild(this.inputTitle);


      // Primary content area.
      this.primaryContent = document.createElement("div");
      this.primaryContent.classList.add("primary-content");
      

      // Input field.
      let inputArea = document.createElement("div");
      inputArea.classList.add("input-area");

      this.input = document.createElement("input");

      if (inputType === "integer" || inputType === "positiveNumber" || inputType === "negativeNumber")
        this.input.type = "number";

      else
        this.input.type = inputType;
      
      if (placeholder)
        this.input.placeholder = placeholder;

      if (callbacksOnAnyKeyPress)
        this.input.addEventListener("keypress", (e) => { 
          for (let callback of callbacksOnAnyKeyPress) {
            callback(e);
          }
        });

      if (callbacksOnAnyKeyUp)
        this.input.addEventListener("keyup", (e) => { 
          for (let callback of callbacksOnAnyKeyUp) {
            callback(e);
          }
        });

      // Suffix label.
      if (suffixLabel)
        this._createSuffixLabel(suffixLabel);

      // Append.
      inputArea.appendChild(this.input);

      if (suffixLabel)
        inputArea.appendChild(this.suffixLabel);

      this.primaryContent.appendChild(inputArea);
      this.component.appendChild(this.primaryContent);


      // Bottom border.
      this.component.classList.add("border-bottom");


      // Helper/error text.
      this.helperText.classList.add("helper-text", "hidden");

      // Append.
      this.component.appendChild(this.helperText);


      // Set up input retrieval.
      this.getInput = () /* string */ => {
        return this.input.value;
      };


      // Listeners.
      if (inputType === "integer")
        this.input.addEventListener("keypress", validation.validateInteger);

      else if (inputType === "number")
        this.input.addEventListener("keypress", validation.validateNumber);

      else if (inputType === "positiveNumber")
        this.input.addEventListener("keypress", validation.validatePositiveNumber);

      else if (inputType === "negativeNumber")
        this.input.addEventListener("keypress", validation.validateNegativeNumber);

    }


    // Suffix label.
    _createSuffixLabel(suffixLabel /* string */) {

      this.suffixLabel = document.createElement("div");
      this.suffixLabel.classList.add("suffix-label");
      this.suffixLabel.textContent = suffixLabel;

    }



    // Helper text
    setHelperText(message /* string */) {

      this.helperText.innerText = message;
      this.helperText.classList.remove("hidden");

    }


    clearHelperText() {

      this.helperText.classList.add("hidden");
      setTimeout(() => {
        this.helperText.innerText = "";
      }, 50);

    }


    setError(message /* string */) {

      this.helperText.classList.add("error");
      this.setHelperText(message);

    }


    clearError() {

      this.clearHelperText();
      this.helperText.classList.remove("error");

    }


    disable() {

      this.component.classList.add("disabled");

    }


    enable() {

      this.component.classList.remove("disabled");

    }


    setInput(input /* string */) {

      this.input.value = input;

    }

}