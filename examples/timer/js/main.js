import * as time1 from "./time1.js";
import * as time2 from "./time2.js";
import * as time3 from "./time3.js";


document.addEventListener("DOMContentLoaded", () => {

  // Set up blinking animation for colons.
  const colons = document.querySelectorAll(".colon");
  window.setInterval(() => {
    
    if (colons[0].style.visibility === "hidden") {

      for (let colon of colons) {
        colon.style.visibility = "visible";
      }

    }

    else {

      for (let colon of colons) {
        colon.style.visibility = "hidden";
      }

    }

  }, 1000);

});


// HUD functions.
window.toggleMode = (e) => {

  if (e.currentTarget.checked) {

    document.documentElement.style.setProperty("--color-object", "var(--palette-light)");
    document.documentElement.style.setProperty("--color-bg", "var(--palette-dark)");

  }

  else {

    document.documentElement.style.setProperty("--color-object", "var(--palette-dark)");
    document.documentElement.style.setProperty("--color-bg", "var(--palette-light)");

  }

}


window.toggleEdge = (e) => {

  if (e.currentTarget.checked) {

    time1.toggleVariableDistortion(false);
    time2.toggleVariableDistortion(false);
    time3.toggleVariableDistortion(false);

  }

  else {

    time1.toggleVariableDistortion(true);
    time2.toggleVariableDistortion(true);
    time3.toggleVariableDistortion(true);

  }

}