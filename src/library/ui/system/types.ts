/* System */
import * as consoleTheme from "../../console-theme";



export type UINodeList = { [ key: string ]:  UIComponent | UIBlock | UIContainer };



// Generic component class that all UIComponents are extended from.
export class UIComponent {

  protected component: HTMLDivElement;


  constructor() {

    this.component = document.createElement("div");

  }


  // Gets the HTML node of the component.
  node(): HTMLDivElement {

    return this.component;

  }

  // Resize UI height due to UI changes like removal of nodes.
  resizeUIHeight(e: UIEvent, reduction: number): void {

    parent.postMessage({ pluginMessage: { call: "ui", command: "resize", args: {
      width: e.view!.innerWidth!,
      height: e.view!.innerHeight! - reduction
    } } }, "*");

  }
}



// Generic class that all form componenets are extended from.
export class UIFormComponent extends UIComponent {

  protected helperText: HTMLDivElement;
  protected state: "enabled" | "disabled" | "error";
  public getInput: Function;


  constructor() {

    super();

    this.component.classList.add("input-element");

    // Creates a helper text div. The component should add this in the right place or it will not appear.
    this.helperText = document.createElement("div");
    this.helperText.classList.add("helpertext", "hidden");

    this.state = "enabled";

    this.getInput = () => { console.log("No functions defined yet.", consoleTheme.error) };

  }


  // Sets the component state to disabled.
  disable(): void {

    this.component.classList.remove("enabled", "error");
    this.component.classList.add("disabled");

    this.state = "disabled";

  }


  // Sets the component state to enabled.
  enable(): void {

    this.component.classList.remove("disabled", "error");
    this.component.classList.add("enabled");

    this.state = "enabled";

  }


  // Sets the component state to error.
  error(message: string) {

    this.component.classList.remove("enabled", "disabled");
    this.component.classList.add("error");

    this.state = "error";

    this.helperText.textContent = message;

  }

}



// Generic block class that all UIBlocks are extended from.
export class UIBlock {

  protected block: HTMLDivElement;
  protected children: UINodeList;


  constructor(nodes?: UINodeList) {

    this.block = document.createElement("div");
    this.block.classList.add("block");

    this.children = { };

    if (nodes)
      this.addChildren(nodes);

  }


  // Returns self.
  node(): HTMLDivElement {

    return this.block;

  }

  // Resize UI height due to UI changes like removal of nodes.
  resizeUIHeight(e: UIEvent, reduction: number): void {

    parent.postMessage({ pluginMessage: { call: "ui", command: "resize", args: {
      width: e.view!.innerWidth!,
      height: e.view!.innerHeight! - reduction
    } } }, "*");

  }


  // Returns a HTMLElement.
  getChildNode(nodeName: string): Node | null {

    let child = this.children[nodeName];

    if (!child)
      return null;

    else
      return child.node();

  }


  // Returns the child as-is, if found.
  getChild(nodeName: string): UIBlock | UIComponent | UIContainer | null {

    return this.children[nodeName] || null;

  }


  // Returns first child node.
  getFirstChild(): UIBlock | UIComponent | UIContainer {

    let allChildrenNames = Object.keys(this.children);
    return this.children[allChildrenNames[0]];

  }


    // Returns last child node.
    getLastChild(): UIBlock | UIComponent | UIContainer {

    let allChildrenNames = Object.keys(this.children);
    return this.children[allChildrenNames[allChildrenNames.length - 1]];

  }


  // Adds a child to the DOM and the list.
  protected addChildren(nodes: UINodeList): void {

    let nodeNames = Object.keys(nodes);

    // Loop through UINodeList.
    for (let name of nodeNames) {

      let newChild = nodes[name];

      // If entry in the UINodeList is a UIBlock or UIComponent.
      if (newChild instanceof UIBlock || newChild instanceof UIComponent || newChild instanceof UIContainer)
        this.block.appendChild(newChild.node());
      
      else
        console.log(`%cError appending child to Block. ${name} is not of a valid type.`, consoleTheme.error);

      // Add it to the children list.
      this.children[name] = nodes[name];

    }

  }

}



// Generic container div to put any content.
export class UIContainer {

  protected container: HTMLDivElement;
  protected children: { [ key: string ]: UIContainer | UIBlock | UIComponent | HTMLElement };


  constructor(settings: {
    nodes: { [ key: string ]: UIContainer | UIBlock | UIComponent | HTMLElement },

    defaultPadding?: boolean;
    padding?: string | number;

    flexDirection?: "column" | "row";
    rowGap?: string | number;
    columnGap?: string | number;
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";

    height?: "hug" | "fill" | CssDimensionValue;
  }) {
    
    this.container = document.createElement("div");
    this.container.classList.add("container");


    // Set padding.
    if (settings.defaultPadding)
      this._setPadding("var(--default-padding");

    if (settings.padding)
      this._setPadding(settings.padding);


    // Set flex layout.
    if (settings.flexDirection ||  settings.rowGap || settings.columnGap || settings.justifyContent)
      this._setFlex(settings.flexDirection, settings.rowGap, settings.columnGap, settings.justifyContent);


    // Set height.
    if (settings.height)
      this._setDimensions(settings.height);


    // Add children.
    this.children = { };
    if (settings.nodes)
      this.addChildren(settings.nodes);

  }


  // Constructor functions.
  private _setPadding(padding: string | number): void {

    if (typeof padding === "string")
      this.container.style.padding = padding;

    else
      this.container.style.padding = `${padding}px`;

  }


  private _setFlex(
    flexDirection: "column" | "row" | undefined,
    rowGap: string | number | undefined,
    columnGap: string | number | undefined,
    justifyContent: "flex-start" | "center" | "flex-end" | "space-between" | undefined
  ): void {

    this.container.style.display = "flex";

    flexDirection = flexDirection ?? "column";
    this.container.style.flexDirection = flexDirection;

    rowGap = rowGap ?? "0";
    if (typeof rowGap === "string") this.container.style.rowGap = rowGap;
    else this.container.style.rowGap = `${rowGap}px`;

    columnGap = columnGap ?? "0.5rem";
    if (typeof columnGap === "string") this.container.style.columnGap = columnGap;
    else this.container.style.columnGap = `${columnGap}px`;

    if (justifyContent)
      this.container.style.justifyContent = justifyContent;

  }


  private _setDimensions(height: "hug" | "fill" | CssDimensionValue): void {

    if (height === "fill")
      this.container.style.height = "100%";

    else if (isCssDimensionValue(height))
      this.container.style.height = `${height.amount}${height.unit}`;

  }


  // Returns self.
  node(): HTMLDivElement {

    return this.container;

  }


  // Returns a HTMLElement.
  getChildNode(nodeName: string): Node | null {

    let child = this.children[nodeName];

    if (!child)
      return null;

    else if (child instanceof UIContainer || child instanceof UIBlock || child instanceof UIComponent)
      return child.node();

    else
      return child;

  }


  // Returns the child as-is, if found.
  getChild(nodeName: string): UIContainer | UIBlock | UIComponent | HTMLElement | null {

    return this.children[nodeName] || null;
    
  }


  // Adds a child to the DOM and the list.
  addChildren(nodes: { [ key: string ]: UIContainer | UIBlock | UIComponent | HTMLElement }): void {

    let nodeNames = Object.keys(nodes);

    // Loop through entries.
    for (let name of nodeNames) {

      let newChild = nodes[name];

      // If entry is a UIBlock or UIComponent.
      if (newChild instanceof UIContainer || newChild instanceof UIBlock || newChild instanceof UIComponent)
        this.container.appendChild(newChild.node());

      else if (newChild instanceof HTMLElement)
        this.container.appendChild(newChild);

      else
        console.log(`%cError appending child to Container. ${name} is not of a valid type.`, consoleTheme.error);

      // Add it to the children list.
      this.children[name] = nodes[name];

    }

  }


  // Removes a child from the DOM.
  removeChild(nodeName: string): void {

    let child = this.children[nodeName];
    if (child) {

      if (!(child instanceof HTMLElement))
        child.node().remove();

      else
        child.remove();

      delete this.children[nodeName];

    }

  }

}



export class UIFragment {
  constructor(nodes: UINodeList) {

    this.fragment = document.createDocumentFragment();

    let nodeNames = Object.keys(nodes);
    for (let nodeName of nodeNames) this.fragment.appendChild(nodes[nodeName].node());

  }

  protected fragment: DocumentFragment;

  addNodes(node: (UIBlock | UIComponent)[]): void {

  }

  publishTo(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) node.appendChild(this.fragment);
    else console.log(`%cError appending fragment to node. Node is not a valid DOM element.`, "color: #f30;");
  }
}



// Parameter types.
export type CssDimensionValue = { unit: "rem" | "px",
                                  amount: number
};

export const isCssDimensionValue = (input: any): input is CssDimensionValue => (
  input.unit &&
  input.amount
);


export type CssClass = { class: string };
export const isCssClass = (input: any): input is CssClass => (
  input.class !== undefined
);


export type ColorOverride = { defaultBackground: string,
                              defaultText: string,
                              hoverBackground?: string,
                              hoverText?: string,
                              activeBackground?: string,
                              activeText?: string
};



// Types guards.

export const isDiv = (element: Element | null): element is HTMLDivElement => (
  element !== null &&
  element.tagName === "DIV"
)