/* Types */             import { UIFormComponent } from "../../system/types";

/* Theme */            import * as theme from "../../../../custom/ui-variants";

/* Helpers */           import * as createSVG from "../../helpers/create-svg";


export class Checkbox extends UIFormComponent {

  protected checkbox: HTMLDivElement;
  protected fillDiameter: number;
  protected text: HTMLDivElement;
  public checked: boolean;
  protected _checked: boolean;
  protected callback: Function = () => { };

  
  constructor(settings: {
    size: theme.Size,
    primaryText: string,

    secondaryText?: string,
    callbacksOnCheck?: Function[],
    callbacksOnUncheck?: Function[]
  }) {

    super();
    

    // Component div.
    this.component.classList.add("component", "checkbox", settings.size);


    // Checkbox.
    this.checkbox = document.createElement("div");
    this.checkbox.classList.add("toggle");

    let fill = document.createElement("div");
    fill.classList.add("fill");
    fill.style.width = "0";
    fill.style.height = "0";
    this.fillDiameter = 0;

    let tick = createSVG.icon(
      20,
      "M19.0694 6.9881L9.54236 18.103L4.96967 13.5303L6.03033 12.4697L9.45763 15.897L17.9306 6.01191L19.0694 6.9881Z", 
      "var(--color-tertiary)"
    );
    tick.classList.add("tick", "icon");


    // Text for checkbox.
    let primary = document.createElement("div");
    primary.classList.add("primary");
    primary.textContent = settings.primaryText;

    let secondary = document.createElement("div");
    secondary.classList.add("secondary");
    if (!settings.secondaryText!) secondary.classList.add("hidden");
    
    this.text = document.createElement("div");
    this.text.classList.add("text");
    this.text.appendChild(primary);
    this.text.appendChild(secondary);
    this.text.appendChild(this.helperText);

    
    // Append.
    this.checkbox.appendChild(fill);
    this.checkbox.appendChild(tick);
    this.component.appendChild(this.checkbox);
    this.component.appendChild(this.text);

    
    // State and listeners.
    this._checked = false;
    this.checked = false;

    this.component.addEventListener("mousedown", (e) => {
      if (this._checked)
        this.uncheck();
      else
        this.check();
    });

    if (settings.callbacksOnCheck) {

      this.component.addEventListener("mousedown", (e) => {
        for (let callback of settings.callbacksOnCheck!) {
          callback(e);
        }
      });

    }

    if (settings.callbacksOnUncheck) {

      this.component.addEventListener("mousedown", (e) => {
        for (let callback of settings.callbacksOnUncheck!) {
          callback(e);
        }
      });

    }

    // Set up input retrieval.
    this.getInput = (): boolean => {
      return this._checked;
    };
    
  }




  private setState(state: boolean): void {

    this._checked = state;
    this.checked = this._checked;
    
  }


  private _getFillDiameter(): number {

    return Math.sqrt(this.checkbox.offsetHeight * this.checkbox.offsetHeight + this.checkbox.offsetWidth * this.checkbox.offsetWidth);
    
  }
  
  
  check(): void {

    // If the fill diameter has not been calculated yet as the component is not yet appended to the DOM.
    if (this.fillDiameter === 0)
      this.fillDiameter = this._getFillDiameter();

    let fill = this.checkbox.children[0] as HTMLElement;
    fill.style.width = `${String(this.fillDiameter)}px`;
    fill.style.height = `${String(this.fillDiameter)}px`;

    let tick = this.checkbox.children[1] as SVGSVGElement;
    tick.style.fill = "var(--color-bg)";

    this.setState(true);

  }


  uncheck(): void {

    let fill = this.checkbox.children[0] as HTMLElement;
    fill.style.width = "0";
    fill.style.height = "0";

    let tick = this.checkbox.children[1] as SVGSVGElement;
    tick.style.fill = "var(--color-tertiary)";

    this.setState(false);

  }


  updatePrimaryText(text: string) {

    let primaryText = this.text.children[0] as HTMLElement;
    primaryText.textContent = text;

    this.fillDiameter = this._getFillDiameter();

  }


  updateSecondaryText(text: string) {

    let secondaryText = this.text.children[1] as HTMLElement;
    secondaryText.textContent = text;

    if (text.length === 0) secondaryText.classList.add("hidden");
    else secondaryText.classList.remove("hidden");

    this.fillDiameter = this._getFillDiameter();

  }

}