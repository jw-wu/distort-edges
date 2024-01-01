// Generic component class that all UIComponents are extended from.
export class UIComponent {

  constructor() {

    this.component = document.createElement("div");
    this.component.classList.add("component");

  }


  // Get the HTML node of the component.
  node() {

    return this.component;

  }

}