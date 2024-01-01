import { UIComponent } from "../../basic-types/component.js";



export class ControlListItem extends UIComponent {

  constructor({

    variant /* "contained" | "outlined" */,
    color /* "primary" | "secondary" | "tertiary" */,
    size /* "small" | "medium" | "large" */,

    label /* string */,
    callbacksOnClick /* Function[] */,
    
    id /* string */

  } = {}) {

    super();


    // Component.
    this.component.classList.add("control-list-item", variant, color, size);


    // ID.
    this.component.dataset.id = id;
    this.id = id;


    // Primary label.
    this.label = document.createElement("div");
    this.label.classList.add("label");
    this.label.textContent = label;

    this.component.appendChild(this.label);


    // State and listeners.
    this.component.addEventListener("mousedown", (e) => {

      this.setAsSelected(e);

      for (let callback of callbacksOnClick) {
        callback(e);
      }

    });

  }



  // Interactions.
  setAsSelected(e) {

    // Remove selected class from previously selected list item.
    let eventTarget = e.currentTarget,
        list = eventTarget.parentElement;

    let previouslySelectedListItem = list.querySelector(".selected");
    if (previouslySelectedListItem)
      previouslySelectedListItem.classList.remove("selected");

    // Set current list item as selected.
    this.component.classList.add("selected");
    this.selected = true;

    // Update the selection indication.
    let selectionIndication = list.querySelector(".selection-indication");
    if (selectionIndication) {

      selectionIndication.style.height = `${this.component.offsetHeight}px`;
      selectionIndication.style.top = `${this.component.offsetTop}px`;
      selectionIndication.style.opacity = "1";

    }

  }


  setAsUnselected() {
    
    this.component.classList.remove("selected");
    this.selected = false;

  }


  toggle(e) {

    if (this.selected) this.setAsUnselected();
    else this.setAsSelected(e);

  }


  update({
    label /* string | undefined */,
    id /* string | undefined */
  } = {}) {

    // Update label.
    if (settings.label)
      this.label.textContent = settings.label;

    // Update id.
    if (settings.id) {

      this.id = settings.id;
      this.component.dataset.id = settings.id;

    }

  }

  
  isSelected() /* boolean */ {

    return this.selected;

  }


  getLabelText() /* string */ {

    return this.label.textContent ?? "";

  }


  getId() /* string */ {

    return this.id;

  }

}