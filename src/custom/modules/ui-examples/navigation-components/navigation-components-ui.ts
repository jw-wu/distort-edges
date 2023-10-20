/* System */
import * as consoleTheme from "../../../../library/console-theme";
import * as type from "../../../../library/figma/system/typegroups";

/* UI */
import * as core from "../../../../library/ui/system/core";

/* Components */      
import { ControlList } from "../../../../library/ui/components/control-list/control-list";

                
let ui = new core.UI({ width: 320 });


// Experiment with the settings to find out more.
let controlList = new ControlList({ variant: "contained",
                                    color: "primary",
                                    size: "medium",
                                    listItems: [],
                                    callbacksOnClick: [ () => { } ],

                                    extendable: { newListItemProperties: { optionName: "New list item" },
                                                  callbacksOnRemove: [ () => { } ],
                                                  createButton: { variant: "outlined",
                                                                  color: "primary",
                                                                  size: "medium",
                                                                  label: "Add list item"
                                                                }
                                                }
});


ui.append([
  controlList
]);