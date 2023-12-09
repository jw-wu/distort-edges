/* System */
import * as consoleTheme from "../../../console-theme";
import { UIFormComponent } from "../../system/types";
import * as theme from "../../../../custom/ui-variants";

/* Components */
import { Menu } from "../menu/menu";

/* Helpers */
import { icon } from "../../helpers/create-svg";

/* SVG */
import { minusSVG } from "../../res/minus";
import { chevronSVG } from "../../res/chevron";


export class Dropdown extends UIFormComponent {

  private _select: HTMLSelectElement;
  // private _selectOptions: { [ optionName: string ]: HTMLOptionElement };

  protected label: HTMLDivElement;
  protected removeButton: HTMLDivElement | undefined;

  protected primaryContent: HTMLDivElement; // For attaching an event listener to show the menu.
  protected selectionDisplay: HTMLDivElement;
  protected showMenuIcon: HTMLDivElement;

  protected menuShown: boolean;
  protected menu: Menu;

    
  constructor(settings: {

      label: string,
      size: theme.Size,
      selectionOptions: {
        [ optionName: string ]: {
          secondaryInfo?: string,
          prefix?: {
            variant: "color" | "icon",
            property: "string" | SVGSVGElement
          }
        }
      }

      options?: {

        placeholder?: string,
        defaultOption?: string,

        removable?: boolean,

        onSelection?: Function

      }

    }) {

      super();


      // Component div.
      this.component.classList.add("component", "dropdown", settings.size);


      // Hidden native select field.
      this._select = document.createElement("select");
      this._select.hidden = true;
      this._createSelectOptions(settings.selectionOptions);

      this.component.appendChild(this._select);
      

      // Label.
      let header = document.createElement("div");
      header.classList.add("header");
      
      this.label = document.createElement("div");
      this.label.textContent = settings.label;
      if (settings.options?.removable)
        this._createRemoveButton();

      header.appendChild(this.label);
      if (this.removeButton) header.appendChild(this.removeButton);
      this.component.appendChild(header);

        
      // Display for the selected option.
      this.primaryContent = document.createElement("div");
      this.primaryContent.classList.add("primary-content");

      this.selectionDisplay = document.createElement("div");
      this.selectionDisplay.classList.add("selection-display");
      if (settings.options?.placeholder)
        this.selectionDisplay.textContent = settings.options.placeholder;
      this.showMenuIcon = document.createElement("div");
      this.showMenuIcon.appendChild(
        icon(24, chevronSVG, "var(--color-primary")
      );
      this.showMenuIcon.classList.add("show-menu-icon");

      this.primaryContent.appendChild(this.selectionDisplay);
      this.primaryContent.appendChild(this.showMenuIcon);
      this.component.appendChild(this.primaryContent);


      // Menu.
      this.menu = new Menu({
        menuOptions: this._generateMenuOptions(settings.selectionOptions),
        size: settings.size,
        options: {
          backdropOnClick: () => {
            this.menuShown = false;
            this.showMenuIcon.style.transform = "rotate(0deg)";
            this.menu.hide();
          }
        }
      });
      this.menu.hide();
      this.menuShown = false;

      this.component.append(this.menu.node());


      // Helper/error text.
      this.helperText.classList.add("helpertext", "hidden");

      // Append.
      this.component.appendChild(this.helperText);


      // Set up input retrieval.
      this.getInput = (): string => {
        return this._select.options[this._select.selectedIndex].value;
      };


      // Listeners.
      this.primaryContent.addEventListener("mousedown", (e) => {
        if (this.menuShown) this.hideMenu()
        else this.showMenu();
      });

      if (settings.options?.onSelection) {

        this._select.addEventListener("change", (e) => {
          settings.options!.onSelection!(e);
        });

      }

    }


    // Constructs the remove button.
    private _createRemoveButton(): void {      

      this.removeButton = document.createElement("div");
      this.removeButton.classList.add("remove-button");        
      this.removeButton.appendChild( icon(16, minusSVG, "var(--color-primary)") );

      this.removeButton.addEventListener("mousedown", (e) => {

        let heightReduction = this.node().offsetHeight;

        this.node().parentNode?.removeChild(this.node());
        this.resizeUIHeight(e, heightReduction);

      });

    }


    // Constructs the hidden select menu.
    private _createSelectOptions(options: {
      [ optionName: string ]: {
        secondaryInfo?: string,
        prefix?: {
          variant: "color" | "icon",
          property: "string" | SVGSVGElement
        }
      }
    }): void {

      let allOptionNames = Object.keys(options);

      for (let optionName of allOptionNames) {

        let option = document.createElement("option");
        option.text = optionName;
        this._select.add(option);
        
      }

    }


    private _generateMenuOptions(options: {
      [ optionName: string ]: {
        secondaryInfo?: string,
        prefix?: { variant: "color" | "icon", property: "string" | SVGSVGElement }
      }
    }): {
      [ optionName: string ]: {
        callback: Function,
        secondaryInfo?: string,
        prefix?: { variant: "color" | "icon", property: "string" | SVGSVGElement }
      }
    } {

      let output: {
        [ optionName: string ]: {
          callback: Function,
          secondaryInfo?: string,
          prefix?: { variant: "color" | "icon", property: "string" | SVGSVGElement }
        }
      } = { };

      let allOptionNames = Object.keys(options);
      for (let optionName of allOptionNames) {
        output[optionName] = {
          callback: this.setSelection,
          secondaryInfo: options[optionName].secondaryInfo,
          prefix: options[optionName].prefix
        };
      }

      return output;
    }


    setError(message: string): void {

      this.helperText.innerText = message;
      this.helperText.classList.remove("hidden");

    }


    clearError(): void {

      this.helperText.classList.add("hidden");
      setTimeout(() => {
        this.helperText.innerText = "";
      }, 250);

    }


    disable(): void {

      // this.input.classList.add("disabled");

    }


    enable(): void {

      // this.input.classList.remove("disabled");

    }


    showMenu(): void {

      this.menu.show();
      this.menuShown = true;

      this.showMenuIcon.style.transform = "rotate(180deg)";

    }


    hideMenu(): void {

      this.menu.hide();
      this.menuShown = false;

      this.showMenuIcon.style.transform = "rotate(0deg)";

    }


    setSelection(input: string): void {

      // this.input.value = input;

    }

}