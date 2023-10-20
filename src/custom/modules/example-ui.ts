/* System */          import * as consoleTheme from "../../library/console-theme";
                      import * as type from "../../library/figma/system/typegroups";

/* UI */              import * as core from "../../library/ui/system/core";

/* Blocks */          import { UserInput } from "../../library/ui/blocks/userinput";

/* Components */      import { UIContainer } from "../../library/ui/system/types";
                      import { Button } from "../../library/ui/components/button/button";
                      import { Checkbox } from "../../library/ui/components/checkbox/checkbox";
                      import { TextField } from "../../library/ui/components/textfield/textfield";

                
let ui = new core.UI({ width: 300 });


let messageDisplay = new UIContainer({  nodes: {},

                                        defaultPadding: true
});
messageDisplay.node().textContent = "Hello World!";


let startButton = new Button({          variant: "contained",
                                        color: "secondary",
                                        size: "medium",
                                        label: "Start plugin",
                                        callback: () => {
                                          core.toPlugin({ command: "start", args: { } });
                                        },

                                        fit: "fill"
});

let exitButton = new Button({           variant: "contained",
                                        color: "primary",
                                        size: "medium",
                                        label: "Close plugin",
                                        callback: () => {
                                          core.toPlugin({ command: "exit", args: { } });
                                        },

                                        fit: "fill"
});

  let ctaBlock = new UIContainer({      nodes:  { startButton,
                                                  exitButton
                                                },

                                        padding: "0.75rem",
                                        rowGap: "0.5rem"
});


ui.append([ messageDisplay,
            ctaBlock
]);