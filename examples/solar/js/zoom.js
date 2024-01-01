// Init.
const sun = document.getElementById("sun"),
      sunContainer = document.getElementById("sun-container"),
      zoom = document.getElementById("zoom");


// Zoom button functionality.
window.zoomView = () => {

  if (sun.classList.contains("fit-to-width")) {

    sunContainer.style.opacity = "0";

    window.setTimeout(() => {

      sun.classList.remove("fit-to-width");
      sun.classList.add("fit-to-height");

      sunContainer.classList.remove("fit-to-width");
      sunContainer.classList.add("fit-to-height");
      sunContainer.style.opacity = "1";

      zoom.textContent = "ZOOM IN";

    }, 400);

  }

  else {

    sunContainer.style.opacity = "0";

    window.setTimeout(() => {

      sun.classList.remove("fit-to-height");
      sun.classList.add("fit-to-width");

      sunContainer.classList.remove("fit-to-height");
      sunContainer.classList.add("fit-to-width");
      sunContainer.style.opacity = "1";

      zoom.textContent = "ZOOM OUT";

    }, 400);

  }

}