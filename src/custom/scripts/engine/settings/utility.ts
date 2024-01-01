/* Engine */
import * as config from "./config";



export const consoleColor = {
  default: "#999",
  inProgress: "#fa0",
  success: "#4caf50",
  error: "#f30"
};

export function debugLog(message: any, color?: string): void {

  if (config.verbose) {
    
    if (color)
      console.log(`%c${message}`, `color: ${color}`);

    else
      console.log(message);

  }
  
}


// All results are rounded off to X decimal places to reduce issues with exponentials.
export function roundOff(number: number) {

  return Math.round(number * Math.pow(10, config.decPlaces)) / Math.pow(10, config.decPlaces);
  
}