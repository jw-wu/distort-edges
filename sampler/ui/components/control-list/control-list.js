import { UIComponent } from "../../basic-types/component.js";
import { ControlListItem } from "./control-list-item.js";



export class ControlList extends UIComponent {

  constructor({

      variant /* "contained" | "outlined" */,
      color /* "primary" | "secondary" | "tertiary" */,
      size /* "small" | "medium" | "large" */,
      orientation /* "vertical" | "horizontal" */,
      listItems /* {  optionName: string, id?: string }[] */,
      callbacksOnClick /* Function[] */,
      defaultOption /* string | undefined */,

    } = {}) {

      super();


      // Set up variant, color and size for future additional options.
      this.variant = variant;
      this.color = color;
      this.size = size;
      this.orientation = orientation;


      // Component div.
      this.component.classList.add("control-list", variant, color, size, orientation);


      // Callbacks if list is customizable. Need to set this up before populating the list.
      this.callbacksOnClick = [ ];
      this.callbacksOnClick.push((e) => {

        let eventTarget = e.currentTarget;
        this.selected = eventTarget.dataset.id ?? "";
        this.setControlListItemAsSelected(eventTarget.children[0].textContent);
        
      });
      this.callbacksOnClick = this.callbacksOnClick.concat(callbacksOnClick);


      // List items & selection indicator.
      this.list = document.createElement("div");
      this.list.classList.add("list");

      this.selectionIndication = document.createElement("div");
      this.selectionIndication.classList.add("selection-indication");
      this.selectionIndication.style.height = "0";
      this.selectionIndication.style.top = "0";
      this.selectionIndication.style.opacity = "0";

      this._populateList(listItems);

      this.list.appendChild(this.selectionIndication);
      this.component.appendChild(this.list);

      
      // Default option.
      if (defaultOption) {

        setTimeout(() => {
          this.setControlListItemAsSelected(defaultOption);
        }, 25);
      
      }

    }


    // Constructs the list items.
    _populateList(listItems /* { optionName: string, id?: string }[] */) {

      let givenListItemsCount = listItems.length;
      for (let i = 0; i < givenListItemsCount; ++i) {

        let givenListItemProperties = listItems[i],
            id = givenListItemProperties.id ? givenListItemProperties.id : `${String(Date.now())}${i}`;

        this.addControlListItem({ optionName: givenListItemProperties.optionName, id: id });

      }

    }


    addControlListItem({ optionName /* string */, id /* string */ } = {}) /* ControlListItem */ {

      // Create list item.
      let listItem = new ControlListItem({
        variant: this.variant,
        color: this.color,
        size: this.size,
        id: id,
        label: optionName,
        callbacksOnClick: this.callbacksOnClick
      });

      this.list.appendChild(listItem.node());

      return listItem;

    }


    // Remove a list item without running remove callbacks.
    removeControlListItem(id /* string */) {

      let listItem = this.component.querySelector(`[data-id="${id}"]`);
      if (listItem instanceof HTMLDivElement) {

        // Remove the list item.
        listItem.remove();

      }

    }


    // Returns a list of list item nodes as an array.
    getAllControlListItems() /* HTMLDivElement[] */ {

      let nodeListOfAllListItems = this.component.querySelectorAll(".control-list-item");
      return Array.from(nodeListOfAllListItems);

    }


    getNumberOfListItems() /* number */ {

      let listItems = this.getAllControlListItems();
      return listItems.length;

    }


    // Set the option as selected, and resets all other options.
    setControlListItemAsSelected(optionName /* string */) {

      let allListItems = this.getAllControlListItems();

      for (let listItem of allListItems) {

        let label = listItem.querySelector(".label");

        if (label.textContent === optionName) {

          listItem.classList.add("selected");

          this.selectionIndication.style.width = `${listItem.offsetWidth}px`;
          this.selectionIndication.style.height = `${listItem.offsetHeight}px`;

          if (this.orientation === "vertical")
            this.selectionIndication.style.top = `${listItem.offsetTop}px`;

          else
            this.selectionIndication.style.left = `${listItem.offsetLeft}px`;

          this.selectionIndication.style.opacity = "1";

          if (listItem.dataset.id)
            this.selected = listItem.dataset.id;

          else
            console.log("No ID found in list item.");

          // listItem.dispatchEvent(new Event("mousedown"));

        }

        else
          listItem.classList.remove("selected");

      }

    }


    // Deselects the selected list item.
    clearSelection() {

      this.selectionIndication.style.opacity = "0";

      let selectedListItem = this.list.querySelector(".selected");
      if (selectedListItem) 
        selectedListItem.classList.remove("selected");

    }


    // Update list item details.
    updateControlListItem({ id /* string */, properties /* { optionName?: string, id?: string } */ } = {}) {

      let listItem = this.component.querySelector(`[data-id="${id}"]`);
      if (listItem instanceof HTMLDivElement) {

        // Update label, without running rename callbacks.
        if (properties.label) {

          let label = listItem.querySelector(".label");

          if (label instanceof HTMLDivElement)
            label.textContent = properties.label;

          // Update selection indicator.
          if (listItem.classList.contains("selected"))
            this.selectionIndication.style.height = `${listItem.offsetHeight}px`;

          else {

            let selectedListItem = listItem.parentElement.querySelector(".selected");
            if (selectedListItem instanceof HTMLDivElement)
              this.selectionIndication.style.top = `${selectedListItem.offsetTop}px`;

          }

        }
        
        // Update id.
        if (properties.id)
          listItem.dataset.id = properties.id;

      }

    }


    // Get selected option name.
    getInput() /* string */ { 
      
      let listItem = this.component.querySelector(".selected");

      if (listItem instanceof HTMLDivElement) {

        let label = listItem.querySelector(".label");

        if (label?.textContent)
          return label.textContent;

      }

      return "";
    
    }


    disable() {

      let allListItems = this.getAllControlListItems();

      for (let listItem of allListItems) {
        listItem.classList.add("disabled");
      }

      if (this.addButton)
        this.addButton.disable();

    }


    enable() {

      let allListItems = this.getAllControlListItems();

      for (let listItem of allListItems) {
        listItem.classList.remove("disabled");
      }

      if (this.addButton)
        this.addButton.enable();

    }

}