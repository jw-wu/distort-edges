/* Types */           import * as type from "../../library/figma/system/typegroups";

/* System */          import { OperationModule } from "../../library/figma/system/modules";
                      import * as input from "../../library/figma/system/quickactioninput"

export const exampleModule = new OperationModule("commandInManifest", true, (parameters: ParameterValues) => {

  figma.notify("Hello World!");

  figma.showUI(__uiFiles__.exampleUI, { themeColors: true });

}, (message: type.UIToPluginMessage) => {

  if (message.command === "start")
    figma.notify("Hello World, from the UI!");

  else if (message.command === "exit")
    figma.closePlugin();

});