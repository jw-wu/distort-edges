/* System */
import * as consoleTheme from "../../../console-theme";
import { UIComponent } from "../../system/types";
import * as theme from "../../../../custom/ui-variants";


export class Menu extends UIComponent {

  protected options: {
    [ optionName: string ]: HTMLDivElement;
  };
  protected invisibleBackdrop: HTMLDivElement;
  public visible: boolean;
  protected _visible: boolean;


  constructor(settings: {
    menuOptions: { [ optionName: string ]: { callback: Function,
                                             secondaryInfo?: string,
                                             prefix?: { variant: "color" | "icon",
                                                        property: "string" | SVGSVGElement
                                             }
                                           }
                 },
    size: theme.Size,

    options?: {

      backdropOnClick: Function

    }
  }) {

    super();

    // Component div.
    this.component.classList.add("component", "menu", settings.size);

    
    // Options.
    this.options = { };
    
    const optionNames = Object.keys(settings.menuOptions);
    for (let optionName of optionNames) {

      let optionProperties = settings.menuOptions[optionName];

      this.options[optionName] = document.createElement("div");
      let option = this.options[optionName];
      option.classList.add("option");
      option.dataset.optionName = optionName;

      let primaryLabel = document.createElement("div");
      primaryLabel.textContent = optionName;
      primaryLabel.classList.add("primary-label");

      option.appendChild(primaryLabel);

      option.addEventListener("mousedown", (e) => {
        optionProperties.callback(e);
      });

      // Secondary info.
      if (optionProperties.secondaryInfo) {

        let secondaryLabel = document.createElement("div");
        secondaryLabel.textContent = optionProperties.secondaryInfo;
        secondaryLabel.classList.add("secondary-label");
        option.appendChild(secondaryLabel);

      }

      this.component.appendChild(option);

    }


    // Invisible backdrop.
    this.invisibleBackdrop = document.createElement("div");
    this.invisibleBackdrop.classList.add("invisible-backdrop");
    this.component.appendChild(this.invisibleBackdrop);
    this.invisibleBackdrop.addEventListener("mousedown", (e) => {

      if (settings.options?.backdropOnClick)
        settings.options.backdropOnClick(e);

      if (this._visible)
        this.hide();
      
    });

    this.component.style.display = "none";
    this._visible = false;
    this.visible = this._visible;

  }


  // Sets the state of the component.
  private _setState(visible: boolean): void {

    this._visible = visible;
    this.visible = this._visible;

  }


  // Hide the menu.
  hide(): void {

    this.node().style.display = "none";
    this._setState(false);

  }


  // Show the menu.
  show(): void {

    this.node().style.display = "block";
    this._setState(true);

  }

}