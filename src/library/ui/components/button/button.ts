/* Types */             import * as uiTypes from "../../system/types";
                        import * as theme from "../../../../custom/ui-variants";

export class Button extends uiTypes.UIComponent {

  protected label: HTMLDivElement;
  protected suffixIcon?: HTMLDivElement;
  protected state: "enabled" | "disabled" | "error";

  
  constructor(settings: {
    variant:    theme.Variant,
    color:      theme.Color | uiTypes.CssClass | uiTypes.ColorOverride,
    size:       theme.Size,
    label:      string,
    callback:   Function,

    fit?: "fill" | "hug",
    suffixIcon?: string
  }) {

    super();

    this.label = document.createElement("div");
    if (settings.suffixIcon) this.suffixIcon = document.createElement("div");

    // Component div.
    this.component.classList.add("component", "button", settings.variant, settings.size, "enabled");


    // Color variant.
    this._setColor(settings.color);


    // Fit.
    if (settings.fit)
      this.component.classList.add(settings.fit);


    // Label.
    this.label.classList.add("label");
    this.label.innerText = settings.label;

    
    // Append all.
    this.component.appendChild(this.label);
    if (this.suffixIcon) this.component.appendChild(this.suffixIcon);

    this.component.addEventListener("click", (e) => { settings.callback(e) });

    this.state = "enabled";

  }


  // Sets the color of the component.
  private _setColor(colorSettings: theme.Color | uiTypes.CssClass | uiTypes.ColorOverride): void {

    // Set color directly if a standard color variant is used.
    if (theme.isColorVariant(colorSettings))
      this.component.classList.add(colorSettings);


    // Else maybe a specific class was given?
    else if (uiTypes.isCssClass(colorSettings))
      this.component.classList.add(colorSettings.class);


    // Or manual overrides perhaps.
    else {

      this.component.style.backgroundColor = colorSettings.defaultBackground;
      this.component.style.color = colorSettings.defaultText;


      // Set hover background color.
      let hoverBackgroundColor = colorSettings.hoverBackground ?
          colorSettings.hoverBackground : `color-mix(in srgb,  var(--color-primary) 10%, ${colorSettings.defaultBackground})`;

      let hoverTextColor = colorSettings.hoverText ?
          colorSettings.hoverText : colorSettings.defaultText;

      this.component.addEventListener("mouseover", (e) => {

        let eventTarget = e.currentTarget;
        if (eventTarget instanceof HTMLDivElement) {

          eventTarget.style.backgroundColor = hoverBackgroundColor;
          eventTarget.style.color = hoverTextColor;
        
        }
        
      });

      this.component.addEventListener("mouseout", (e) => {

        let eventTarget = e.currentTarget;
        if (eventTarget instanceof HTMLDivElement) {

          eventTarget.style.backgroundColor = colorSettings.defaultBackground;
          eventTarget.style.color = colorSettings.defaultText;
        
        }
        
      });
      

      // Set hover text color.
      if (colorSettings.hoverText)
        this.component.style.color = colorSettings.hoverText;

      // Set active background color.
    }

  }

  error(): void {
    this.component.classList.remove(this.state);
    this.component.classList.add("error");
    this.state = "error";
  }

  disable(): void {
    this.component.classList.remove(this.state);
    this.component.classList.add("disabled");
    this.state = "disabled";
  }

  enable(): void {
    this.component.classList.remove(this.state);
    this.component.classList.add("enabled");
    this.state = "enabled";
  }

}