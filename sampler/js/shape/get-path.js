import { createEllipse } from "./create-ellipse.js";
import { createRectangle } from "./create-rectangle.js";



export function getPath(shape, width, height) {

  switch(shape) {

    case "Ellipse":
      return createEllipse(width, height);

    case "Rectangle":
      return createRectangle(width, height);

  }

  return "";

}