/* Types */           import * as type from "../../../../library/figma/system/typegroups";

/* System */          import { OperationModule } from "../../../../library/figma/system/modules";
                      import * as input from "../../../../library/figma/system/quickactioninput"

export const navigationComponents = new OperationModule("navigationComponents", true, (parameters: ParameterValues) => {

  figma.showUI(__uiFiles__.navigationComponents, { themeColors: true });

}, (message: type.UIToPluginMessage) => {

  if (message.command === "notify")
    figma.notify(message.args.message, { timeout: 300 });

  else if (message.command === "exit")
    figma.closePlugin();

});