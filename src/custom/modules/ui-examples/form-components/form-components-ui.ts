/* System */          import * as consoleTheme from "../../../../library/console-theme";
                      import * as type from "../../../../library/figma/system/typegroups";

/* UI */              import * as core from "../../../../library/ui/system/core";

/* Blocks */          import { UserInput } from "../../../../library/ui/blocks/userinput";

/* Components */      import { UIContainer } from "../../../../library/ui/system/types";
                      import { Button } from "../../../../library/ui/components/button/button";
                      import { Checkbox } from "../../../../library/ui/components/checkbox/checkbox";
                      import { TextField } from "../../../../library/ui/components/textfield/textfield";
                      import { Dropdown } from "../../../../library/ui/components/dropdown/dropdown";


                
let ui = new core.UI({ width: 500 });


// Experiment with the settings to find out more.
let textField = new TextField({       label: "Input label",
                                      inputType: "text",
                                      size: "medium",
                                      
                                      prefix: { variant: "color" },
                                      placeholder: "Hex code"
});


let checkbox = new Checkbox({         size: "medium",
                                      primaryText: "Checkbox label",
                                      secondaryText: "Secondary info",

                                      callbacksOnCheck: [ notifyCheckboxStatus ],
                                      callbacksOnUncheck: [ notifyCheckboxStatus ]
});


let dropdown = new Dropdown({         label: "Dropdown label",
                                      size: "medium",
                                      selectionOptions: { "Option 1": { secondaryInfo: "Secondary info" },
                                                          "Option 2": { secondaryInfo: "Secondary info" }
                                                        },

                                      options: { placeholder: "Select an option" }
});


let form = new UserInput();
form.addInputComponent({              textField: textField,
                                      checkbox: checkbox,
                                      dropdown: dropdown
});


let button = new Button({             variant: "contained",
                                      color: "primary",
                                      size: "medium",
                                      label: "Close plugin",
                                      callback: () => {
                                        core.toPlugin({ command: "exit", args: { } });
                                      },

                                      fit: "fill"
});

let buttonWrapper = new UIContainer({ nodes:  { button: button,
                                              },
  
                                      defaultPadding: true,
});


ui.append([ form,
            buttonWrapper
]);



function notifyCheckboxStatus(): void {

  if (checkbox.checked)
    core.toPlugin({ command: "notify", args: { message: "The checkbox is checked." } });

  else
    core.toPlugin({ command: "notify", args: { message: "The checkbox is not checked." } });

}