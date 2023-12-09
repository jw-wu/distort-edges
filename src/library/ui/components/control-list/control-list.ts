/* System */
import * as consoleTheme from "../../../console-theme";
import * as types from "../../system/types";
import * as theme from "../../../../custom/ui-variants";

/* Helpers */
import * as color from "../../helpers/color";

/* Components */
import { Button } from "../button/button";
import { ControlListItem } from "./control-list-item";



export class ControlList extends types.UIComponent {

  protected list: HTMLDivElement;
  protected selectionIndication: HTMLDivElement;
  protected addButton: Button | undefined;

  // Custom callbacks that are run after the components internal functions.
  protected readonly callbacksOnClick: Function[] = [ ];
  protected readonly callbacksOnRemove: Function[] = [ ];
  protected readonly callbacksOnRename: Function[] = [ ];

  protected readonly variant: theme.Variant;
  protected readonly color: theme.Color;
  protected readonly size: theme.Size;
  protected readonly renamable: boolean;

  protected selected: string = "";

  
  constructor(settings: {

      variant: theme.Variant,
      color: theme.Color,
      size: theme.Size,
      listItems:  { optionName: string,
                    secondaryInfo?: string,
                    prefix?:  { variant: "color" | "icon",
                                property: string | SVGSVGElement
                              },
                    id?: string
                  }[],
      callbacksOnClick: Function[],

      extendable?:  { newListItemProperties:  { optionName: string,
                                                secondaryInfo?: string,
                                                prefix?:  { variant: "color" | "icon",
                                                            property: string | SVGSVGElement
                                                          },
                                                id?: string,
                                              },
                      callbacksAfterCreation?: Function[]
                      callbacksOnRemove: Function[],
                      createButton: { variant: theme.Variant,
                                      color: theme.Color,
                                      size: theme.Size,
                                      label: string
                                    }
                    }
      renamable?: boolean,
      callbacksOnRename?: Function[],
      defaultOption?: string,

    }) {

      super();


      // Set up variant, color and size for future additional options.
      this.variant = settings.variant;
      this.color = settings.color;
      this.size = settings.size;
      this.renamable = settings.renamable ?? false;


      // Component div.
      this.component.classList.add("component", "control-list", this.variant, this.color, this.size);


      // Callbacks if list is customizable. Need to set this up before populating the list.
      this.callbacksOnClick.push((e: UIEvent) => {

        let eventTarget = e.currentTarget as HTMLDivElement;
        this.selected = eventTarget.dataset.id ?? "";

        console.log(`%cList item selected: ${this.selected}.`, consoleTheme.tertiary);

      });
      this.callbacksOnClick = this.callbacksOnClick.concat(settings.callbacksOnClick);

      if (settings.extendable) {

        // Remove the item from the internal list. Does not remove the element.
        this.callbacksOnRemove.push((e: UIEvent) => {

          let eventTarget = e.currentTarget as HTMLDivElement,
              targetListItemId = eventTarget.dataset.id ?? "";

          // If list item to be removed is currently selected, reset the selected record and hide the selection indication.
          if (targetListItemId === this.selected) {

            this.selected = "";            
            this.selectionIndication.style.opacity = "0";

          }

          // If not, match the selection indication to the selected record.
          else {

            let selectedListItem = this.component.querySelector(".selected") as HTMLDivElement;
            if (selectedListItem)
              setTimeout(() => {
                this.selectionIndication.style.top = `${selectedListItem.offsetTop}px`;
              }, 15);

          }

        });
        this.callbacksOnRemove = this.callbacksOnRemove.concat(settings.extendable!.callbacksOnRemove);

      }

      if (settings.callbacksOnRename)
        this.callbacksOnRename = this.callbacksOnRename.concat(settings.callbacksOnRename);


      // List items & selection indicator.
      this.list = document.createElement("div");
      this.list.classList.add("list");

      this.selectionIndication = document.createElement("div");
      this.selectionIndication.classList.add("selection-indication");
      this.selectionIndication.style.height = "0";
      this.selectionIndication.style.top = "0";
      this.selectionIndication.style.opacity = "0";

      this._populateList(settings.listItems);

      this.list.appendChild(this.selectionIndication);
      this.component.appendChild(this.list);

      
      // Button.
      if (settings.extendable)
        this._createButton(
          settings.extendable.createButton,
          settings.extendable.newListItemProperties,
          settings.extendable.callbacksAfterCreation
        );

      
      // Default option.
      if (settings.defaultOption) {

        setTimeout(() => {
          this.setControlListItemAsSelected(settings.defaultOption!);
        }, 25);
      
      }

    }


    // Constructs the list items.
    private _populateList(
      listItems: { optionName: string
                   secondaryInfo?: string,
                   prefix?: { variant: "color" | "icon",
                              property: string | SVGSVGElement
                            },
                   id?: string
                 }[]
    ): void {

      let givenListItemsCount = listItems.length;
      for (let i = 0; i < givenListItemsCount; ++i) {

        let givenListItemProperties = listItems[i],
            id: string = givenListItemProperties.id ? givenListItemProperties.id : `${String(Date.now())}${i}`;

        this.addControlListItem(id, givenListItemProperties);

      }

    }


    private _createButton(
      buttonProperties: { variant: theme.Variant,
                          color: theme.Color,
                          size: theme.Size,
                          label: string,
                        },
      newListItemProperties: { optionName: string,
                               secondaryInfo?: string,
                               prefix?: { variant: "color" | "icon",
                                          property: string | SVGSVGElement
                                        },
                               id?: string,
                             },
      callbacksAfterCreation?: Function[]
    ): void {

      this.addButton = new Button({

        variant: buttonProperties.variant,
        color: buttonProperties.color,
        size: buttonProperties.size,
        label: buttonProperties.label,
        callback: () => {

          let newOption = this.addControlListItem(`${Date.now()}0`, newListItemProperties);

          if (callbacksAfterCreation) {
            for (let callback of callbacksAfterCreation) {
              callback(newOption);
            }
          }

          newOption.enterRenameMode();

        },

        fit: "fill"

      });

      this.component.appendChild(this.addButton.node());

    }


    addControlListItem(
      id: string,
      listItemProperties: { optionName: string,
                            secondaryInfo?: string,
                            prefix?: { variant: "color" | "icon",
                                       property: string | SVGSVGElement
                                     }
                          }
    ): ControlListItem {

      // Create list item.
      let listItem = new ControlListItem({
        variant: this.variant,
        color: this.color,
        size: this.size,
        
        id: id,
        label: listItemProperties.optionName,
        secondaryInfo: listItemProperties.secondaryInfo,
        prefix: listItemProperties.prefix,

        userRenamable: this.renamable,

        callbacksOnClick: this.callbacksOnClick,
        callbacksOnRemove: (this.callbacksOnRemove.length !== 0) ? this.callbacksOnRemove : undefined,
        callbacksOnRename: (this.callbacksOnRename.length !== 0) ? this.callbacksOnRename : undefined

      });

      this.list.appendChild(listItem.node());

      return listItem;

    }


    // Remove a list item without running remove callbacks.
    removeControlListItem(id: string): void {

      let listItem = this.component.querySelector(`[data-id="${id}"]`);
      if (types.isDiv(listItem)) {

        // Removes the invisible backdrop in case the list item is in rename mode.
        if (listItem.classList.contains("renaming")) {

          let invisibleBackdrop = document.getElementById("control-list-item-invisible-backdrop");
          if (types.isDiv(invisibleBackdrop))
            invisibleBackdrop.remove();

        }

        // Remove the list item.
        listItem.remove();

      }

    }


    // Returns a list of list item nodes as an array.
    getAllControlListItems(): HTMLDivElement[] {

      let nodeListOfAllListItems = this.component.querySelectorAll(".control-list-item") as NodeListOf<HTMLDivElement>;
      return Array.from(nodeListOfAllListItems);

    }


    getNumberOfListItems(): number {

      let listItems = this.getAllControlListItems();
      return listItems.length;

    }


    // Set the option as selected, and resets all other options.
    setControlListItemAsSelected(optionName: string): void {

      let allListItems = this.getAllControlListItems();

      for (let listItem of allListItems) {

        let label = listItem.querySelector(".label")!;

        if (label.textContent === optionName) {

          listItem.classList.add("selected");

          this.selectionIndication.style.height = `${listItem.offsetHeight}px`;
          this.selectionIndication.style.top = `${listItem.offsetTop}px`;
          this.selectionIndication.style.opacity = "1";

          if (listItem.dataset.id)
            this.selected = listItem.dataset.id;

          else
            console.log("No ID found in list item.");

          listItem.dispatchEvent(new Event("mousedown"));

        }

        else
          listItem.classList.remove("selected");

      }

    }


    // Deselects the selected list item.
    clearSelection(): void {

      this.selectionIndication.style.opacity = "0";

      let selectedListItem = this.list.querySelector(".selected");
      if (selectedListItem) 
        selectedListItem.classList.remove("selected");

    }


    // Update list item details.
    updateControlListItem(id: string, properties: {
      prefixProperty?: string | SVGSVGElement,
      label?: string,
      secondaryInfo?: string,
      id?: string
    }): void {

      let listItem = this.component.querySelector(`[data-id="${id}"]`);
      if (types.isDiv(listItem)) {

        if (properties.prefixProperty) {

          // Update prefix.
          let prefix = listItem.querySelector(".prefix");
          if (types.isDiv(prefix) && prefix.classList.contains("swatch") && typeof properties.prefixProperty === "string") {

            if (color.isHex(properties.prefixProperty))
              prefix.style.backgroundColor = color.expandHex(properties.prefixProperty);

            else
              console.log("%cProperty type does not match prefix type.", consoleTheme.error);

          }
        
        }


        // Update label, without running rename callbacks.
        if (properties.label) {

          let label = listItem.querySelector(".label");

          if (types.isDiv(label))
            label.textContent = properties.label;

        }

        
        // Update secondary info.
        if (properties.secondaryInfo) {

          let secondaryInfo = listItem.querySelector(".secondary-info");

          if (types.isDiv(secondaryInfo))
            secondaryInfo.textContent = properties.secondaryInfo;

        }

        
        // Update id.
        if (properties.id)
          listItem.dataset.id = properties.id;


        // Update selection indicator.
        if (properties.prefixProperty || properties.label || properties.secondaryInfo) {

          if (listItem.classList.contains("selected"))
            this.selectionIndication.style.height = `${listItem.offsetHeight}px`;

          else {

            let selectedListItem = listItem.parentElement!.querySelector(".selected");
            if (types.isDiv(selectedListItem))
              this.selectionIndication.style.top = `${selectedListItem.offsetTop}px`;

          }
          
        }

      }

    }


    // Get selected option name.
    getInput(): string { 
      
      let listItem = this.component.querySelector(".selected");

      if (listItem instanceof HTMLDivElement) {

        let label = listItem.querySelector(".label");

        if (label?.textContent)
          return label.textContent;

      }

      return "";
    
    }


    disable(): void {

      let allListItems = this.getAllControlListItems();

      for (let listItem of allListItems) {
        listItem.classList.add("disabled");
      }

      if (this.addButton)
        this.addButton.disable();

    }


    enable(): void {

      let allListItems = this.getAllControlListItems();

      for (let listItem of allListItems) {
        listItem.classList.remove("disabled");
      }

      if (this.addButton)
        this.addButton.enable();

    }

}