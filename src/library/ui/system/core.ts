/* Types */           import { UIBlock, UIComponent, UIContainer } from "./types";
/* System */          import { Deferred } from "../../figma/system/deferred";


export class UI {

  protected panel: HTMLDivElement;
  protected width: number;
  protected height: number = 0;
  protected additionalHeight: number;
  

  constructor(settings: { width: number, additionalHeight?: number }) {

    // Set UI div.
    let insertionPoint = document.getElementById("ui");
    if (insertionPoint instanceof HTMLDivElement)
      this.panel = insertionPoint;

    else {
      this.panel = document.createElement("div");
      document.body.appendChild(this.panel);
    }

    // Store width and additionalHeight of UI.
    this.width = settings.width;
    this.additionalHeight = settings.additionalHeight ?? 0;


    // Resize UI.
    this.resizeOnUIUpdate();


    // Log to console for debugging.
    console.log("%cUI created.", "color: #ccc;");
    console.log(this.panel);

  }
  

  append(nodes: (UIBlock | UIComponent | UIContainer | HTMLDivElement)[]): void {

    // Append elements to a fragment before appending to the UI.
    let fragment = document.createDocumentFragment();

    for (let node of nodes) {
      if (node instanceof UIBlock || node instanceof UIComponent || node instanceof UIContainer)
        fragment.appendChild(node.node());

      else
        fragment.appendChild(node);
    }

    this.panel.appendChild(fragment);

  }


  resizeOnUIUpdate(): void {

    const uiResizeObserver = new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {

      // Stores height for reference by future observations to judge if resize is needed.
      this.height = this.panel.offsetHeight;

      parent.postMessage({ pluginMessage: {
        call: "ui",
        command: "resize",
        args: { width: this.width, height: this.panel.offsetHeight + this.additionalHeight }
      } }, "*");

    });

    uiResizeObserver.observe(this.panel, {
      childList: true,
      subtree: true
    });

  }


  resize(settings: { width: number | "nochange" | "dom", height: number | "nochange" | "dom" }): void {

      if (typeof settings.width === "number")
        this.width = settings.width;

      if (typeof settings.height === "number")
        this.height = settings.height;


      parent.postMessage({ pluginMessage: {
        call: "ui",
        command: "resize",
        args: {
          width: (settings.width === "dom") ? this.panel.offsetWidth : this.width,
          height: (settings.height === "dom") ? this.panel.offsetHeight + this.additionalHeight : this.height
        }
      } }, "*");

  }

}


// Send message to the plugin.
export function toPlugin(message: {
  command: string,
  args: { [ key: string ]: any }
}): void {

  parent.postMessage({ pluginMessage: { call: "module", command: message.command, args: message.args } }, "*");

}


// Listen to messages from the plugin.
export function fromPlugin(parseCommands: Function): void {

  onmessage = (e) => {

    parseCommands(e.data.pluginMessage);

  }

}