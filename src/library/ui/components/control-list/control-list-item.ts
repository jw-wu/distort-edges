/* System */
import * as consoleTheme from "../../../console-theme";
import { UIComponent } from "../../system/types";
import * as theme from "../../../../custom/ui-variants";

/* Helpers */
import { icon } from "../../helpers/create-svg";
import * as color from "../../helpers/color";

/* SVG */
import { minusSVG } from "../../res/minus";
import { editSVG } from "../../res/edit";
import { returnSVG } from "../../res/return";
import { closeSVG } from "../../res/close";



export class ControlListItem extends UIComponent {

  protected prefix: HTMLDivElement | undefined;
  protected label: HTMLDivElement;
  protected input: HTMLInputElement | undefined;
  protected editLabelButton: HTMLDivElement | undefined;
  protected secondaryInfo: HTMLDivElement | undefined;

  protected id: string;
  protected selected: boolean = false;


  constructor(settings: {

    variant: theme.Variant,
    color: theme.Color,
    size: theme.Size,

    label: string,
    callbacksOnClick: Function[],
    
    id: string,
    secondaryInfo?: string,
    prefix?: { variant: "color" | "icon",
               property: string | SVGSVGElement
             },

    userRenamable?: boolean,
    callbacksOnRename?: Function[]
    callbacksOnRemove?: Function[],

  }) {

    super();


    // Component.
    this.component.classList.add("component", "control-list-item", settings.variant, settings.color, settings.size);


    // ID.
    this.component.dataset.id = settings.id;
    this.id = settings.id;


    // Prefix swatch / icon.
    if (settings.prefix)
    this._addPrefixGraphic(settings.prefix);


    // Primary label.
    this.label = document.createElement("div");
    this.label.classList.add("label");
    this.label.textContent = settings.label;

    this.component.appendChild(this.label);

    
    // Secondary label.
    if (settings.secondaryInfo)
      this._addSecondaryInfo(settings.secondaryInfo);


    // Icons: Edit and Remove.
    if (settings.userRenamable || settings.callbacksOnRemove) {

      let icons = document.createElement("div");
      icons.classList.add("icons");
      icons.style.display = "flex";
      icons.style.flexDirection = "row";
      icons.style.columnGap = "0.5rem";
      icons.style.alignItems = "center";

      // Edit label button and confirm-rename button.
      if (settings.userRenamable) {

        this.input = this._createInput();
        this.component.appendChild(this.input);

        let confirmLabelEditsButton = this._createConfirmLabelEditsButton();
        icons.appendChild(confirmLabelEditsButton);
      
        this.editLabelButton = this._createEditLabelButton();
        icons.appendChild(this.editLabelButton);
      
      }

      // Remove button.
      if (settings.callbacksOnRemove) {

        let removeButton = this._createRemoveButton(settings.callbacksOnRemove);
        icons.appendChild(removeButton);

      }

      this.component.appendChild(icons);
    
    }


    // State and listeners.
    this.component.addEventListener("mousedown", (e) => {
      if (!this.component.classList.contains("renaming") && !this.component.classList.contains("removing")) {

        this.setAsSelected(e);

        for (let callback of settings.callbacksOnClick) {
          callback(e);
        }

      }
    });


    if (settings.callbacksOnRename) {

      this.label.addEventListener("change", (e) => {
        for (let callback of settings.callbacksOnRename!) {
          callback(e);
        }

        setTimeout(() => {
          this.component.dispatchEvent(new Event("mousedown"));
        }, 5);
      });

    }

  }


  // Constructs a secondary info element if required.
  private _addSecondaryInfo(text: string): void {

    this.secondaryInfo = document.createElement("div");
    this.secondaryInfo.classList.add("secondary-info");
    this.secondaryInfo.textContent = text;

    this.component.appendChild(this.secondaryInfo);

  }


  // Constructs a prefix element if required.
  private _addPrefixGraphic(prefix: {
    variant: "color" | "icon",
    property: string | SVGSVGElement
  }): void {

    this.prefix = document.createElement("div");
    this.prefix.classList.add("prefix");

    if (prefix.variant === "color" && typeof prefix.property === "string") {

      this.prefix.classList.add("swatch");
      this.prefix.style.backgroundColor = color.expandHex(prefix.property);

    }

    else if (typeof prefix.property !== "string") {

      this.prefix.appendChild(prefix.property);

    }

    this.component.appendChild(this.prefix);

  }


  // Constructs an input field.
  private _createInput(): HTMLInputElement {

    let input = document.createElement("input");
    input.addEventListener("keypress", (e) => {

      if (e.key === "Enter")
        setLabelViaKeyboard(e);

    });

    return input;

  }


  // Constructs an edit label button if list item is user-renamable.
  private _createEditLabelButton(): HTMLDivElement {

    let editLabelButton = document.createElement("div");
    editLabelButton.classList.add("edit-label-button");
    editLabelButton.appendChild( icon(20, editSVG, "var(--color-primary") );
    editLabelButton.addEventListener("mousedown", editLabel);

    return editLabelButton;
  }


  // Constructs a rename confirmation button if list item is user-renamable.
  private _createConfirmLabelEditsButton(): HTMLDivElement {

    let confirmLabelEditsButton = document.createElement("div");
    confirmLabelEditsButton.classList.add("confirm-label-edit-button");
    confirmLabelEditsButton.appendChild( icon(20, returnSVG, "var(--color-primary)") );
    confirmLabelEditsButton.addEventListener("mousedown", setLabelViaIcon );

    return confirmLabelEditsButton;

  }


  // Constructs a remove button if list is customizable.
  private _createRemoveButton(callbacks: Function[]): HTMLDivElement {

    let removeButton = document.createElement("div");
    removeButton.classList.add("remove-list-item-button");
    removeButton.dataset.id = this.id;
    removeButton.appendChild( icon(20, minusSVG, "var(--color-primary)") );
    removeButton.addEventListener("mousedown", (e) => {

      let eventTarget = e.currentTarget as HTMLDivElement,
          listItem = eventTarget.parentElement!.parentElement! as HTMLDivElement,
          list = listItem.parentElement! as HTMLDivElement,
          selectionIndication = list.querySelector(".selection-indication") as HTMLDivElement;

      // Adds a removing class to the list item so that it will not trigger the list item callback.
      listItem.classList.add("removing");

      // Repositions the selection indication, or hide it.
      if (listItem.classList.contains("selected"))
        selectionIndication.style.opacity = "0";

      else {

        let selectedListItem = list.querySelector(".selected") as HTMLDivElement;
        if (selectedListItem)
            selectionIndication.style.top = `${selectedListItem.offsetTop}px`;

      }

      // Remove the list item.
      this.node().remove();

      // Run the callbacks.
      for (let callback of callbacks) {
        callback(e);
      }

    });

    return removeButton;

  }


  // Interactions.
  setAsSelected(e: Event): void {

    // Remove selected class from previously selected list item.
    let eventTarget = e.currentTarget as HTMLDivElement,
        list = eventTarget.parentElement!;

    let previouslySelectedListItem = list.querySelector(".selected") as HTMLDivElement;
    if (previouslySelectedListItem)
      previouslySelectedListItem.classList.remove("selected");

    // Set current list item as selected.
    this.component.classList.add("selected");
    this.selected = true;

    // Update the selection indication.
    let selectionIndication = list.querySelector(".selection-indication") as HTMLDivElement;
    if (selectionIndication) {

      selectionIndication.style.height = `${this.component.offsetHeight}px`;
      selectionIndication.style.top = `${this.component.offsetTop}px`;
      selectionIndication.style.opacity = "1";

    }

  }


  setAsUnselected(): void {
    
    this.component.classList.remove("selected");
    this.selected = false;

  }


  toggle(e: Event): void {

    if (this.selected) this.setAsUnselected();
    else this.setAsSelected(e);

  }


  enterRenameMode(): void {

    this.editLabelButton?.dispatchEvent(new Event("mousedown"));

  }


  update(settings: {
    prefixProperty?: string | SVGSVGElement,
    label?: string,
    secondaryInfo?: string,
    id?: string
  }) {

    if (settings.prefixProperty) {

      // Update prefix.
      if (this.prefix?.classList.contains("swatch") && typeof settings.prefixProperty === "string") {

        if (color.isHex(settings.prefixProperty))
          this.prefix.style.backgroundColor = color.expandHex(settings.prefixProperty);

        else
          console.log("%cProperty type does not match prefix type.", consoleTheme.error);

      }


      // Update label.
      if (settings.label)
        this.label.textContent = settings.label;

      
      // Update secondary info.
      if (settings.secondaryInfo && this.secondaryInfo)
        this.secondaryInfo.textContent = settings.secondaryInfo;

      
      // Update id.
      if (settings.id) {

        this.id = settings.id;
        this.component.dataset.id = settings.id;

      }

    }

  }

  
  isSelected(): boolean {

    return this.selected;

  }


  getLabelText(): string {

    return this.label.textContent ?? "";

  }


  getId(): string {

    return this.id;

  }

}

function editLabel(e: Event): void {

  let eventTarget = e.target as HTMLDivElement,
      component = eventTarget.parentElement!.parentElement!,
      label = component.querySelector(".label")!,
      input = component.querySelector("input")!;

      
  // Creates an invisible backdrop to capture clicks.
  let invisibleBackdrop = document.createElement("div");
  invisibleBackdrop.id = "control-list-item-invisible-backdrop";
  invisibleBackdrop.style.width = "100vw";
  invisibleBackdrop.style.height = "100vh";
  invisibleBackdrop.style.position = "fixed";
  invisibleBackdrop.style.top = "0";
  invisibleBackdrop.style.left = "0";
  invisibleBackdrop.style.zIndex = "50";
  invisibleBackdrop.addEventListener("mousedown", cancelLabelEdit);
  component.parentElement!.appendChild(invisibleBackdrop);

  // Sets the component to renaming mode.
  component.classList.add("renaming");

  // Replace the pen icon with the close icon.
  eventTarget.children[0].remove();
  eventTarget.removeEventListener("mousedown", editLabel);
  eventTarget.appendChild( icon(20, closeSVG, "var(--color-primary)") );
  eventTarget.addEventListener("mousedown", cancelLabelEdit);
  
  // Sets focus on input.
  input.value = label.textContent!;
  setTimeout(() => {

    input.focus();
    input.select();

  }, 15);

}


function setLabelViaIcon(e: Event): void {

  let eventTarget = e.target as HTMLDivElement,
      component = eventTarget.parentElement!.parentElement!,
      label = component.querySelector(".label")!,
      input = component.querySelector("input")!,
      editLabelButton = component.querySelector(".edit-label-button")!,
      invisibleBackdrop = component.parentElement!.querySelector("#control-list-item-invisible-backdrop");

  // Get rid of invisible backdrop.
  invisibleBackdrop?.remove();

  // Replace the close icon with the pen icon.
  editLabelButton.children[0].remove();
  editLabelButton.removeEventListener("mousedown", cancelLabelEdit);
  editLabelButton.appendChild( icon(20, editSVG, "var(--color-primary)") );
  editLabelButton.addEventListener("mousedown", editLabel);

  // Sets the label of the component.
  if (input.value.length !== 0) {

    label.textContent = input.value;
    label.dispatchEvent(new Event("change"));

  }

  // Sets the component to normal mode.
  component.classList.remove("renaming");

}


function setLabelViaKeyboard(e: Event): void {

  let eventTarget = e.target as HTMLInputElement,
      component = eventTarget.parentElement!,
      label = component.querySelector(".label")!,
      editLabelButton = component.querySelector(".edit-label-button")!,
      invisibleBackdrop = component.parentElement!.querySelector("#control-list-item-invisible-backdrop");

  // Get rid of invisible backdrop.
  invisibleBackdrop?.remove();

  // Replace the close icon with the pen icon.
  editLabelButton.children[0].remove();
  editLabelButton.removeEventListener("mousedown", cancelLabelEdit);
  editLabelButton.appendChild( icon(20, editSVG, "var(--color-primary)") );
  editLabelButton.addEventListener("mousedown", editLabel);

  // Sets the label of the component.
  if (eventTarget.value.length !== 0) {

    label.textContent = eventTarget.value;
    label.dispatchEvent(new Event("change"));

  }

  // Sets the component to normal mode.
  component.classList.remove("renaming");

}


function cancelLabelEdit(e: Event): void {

  let eventTarget: HTMLDivElement = e.target as HTMLDivElement;
  
  if (eventTarget.id === "control-list-item-invisible-backdrop") {

    let selectedListItem = eventTarget.parentElement!.querySelector(".renaming")!;
    eventTarget = selectedListItem.querySelector(".icons")!.querySelector(".edit-label-button")!;
  
  }

  let component = eventTarget.parentElement!.parentElement!,
      input = component.querySelector("input")!;


  // Get rid of invisible backdrop.
  let invisibleBackdrop = component!.parentElement!.querySelector("#control-list-item-invisible-backdrop");
  invisibleBackdrop?.remove();

  // Clear the input field.
  input.value = "";

  // Replace the close icon with the pen icon.
  eventTarget.children[0].remove();
  eventTarget.removeEventListener("mousedown", cancelLabelEdit);
  eventTarget.appendChild( icon(20, editSVG, "var(--color-primary)") );
  eventTarget.addEventListener("mousedown", editLabel);

  // Sets the component to normal mode.
  component.classList.remove("renaming");

}