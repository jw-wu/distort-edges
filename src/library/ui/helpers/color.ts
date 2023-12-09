// I couldn't be arsed to find what I did before so I just googled.
// https://stackoverflow.com/questions/50890731/rgba-and-rgb-to-hex
export function figmaToHex(figma: number[]): string {
  let opacity = figma[3] === 1 ? "" : Math.round(figma[3] * 100);
  return [ "#", toHex(figma[0]), toHex(figma[1]), toHex(figma[2]), opacity ].join("");
}


export function figmaToRGBA(figma: number[]): string {
  return `rgba(${toRGB(figma[0])}, ${toRGB(figma[1])}, ${toRGB(figma[2])}, ${Math.round(figma[3] * 100) / 100})`;
}


export function rgbToHex(): void {

}


export function hexToRGB(): void {

}




function toHex(pct: number): string {

  let hex = toRGB(pct).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
  
}


function toRGB(pct: number): number {

  let value = Math.round(Math.round((pct * 255) * 100) / 100)
  return value > 255 ? 255 : value;

}




// Test if string is a hex code.
export function isHex(input: string): boolean {

  return /^(#?[0-9A-F]{6})|(#?[0-9A-F]{1,3})$/i.test(input);

}


// Converts hex shorthand to longform.
export function expandHex(input: string): string {

  input = input.replace("#", "");
  let charCount = input.length;

  switch(charCount) {

    case 1:
      input = Array(6).fill(input).join("");
      break;

    case 2:
      input = Array(3).fill(input).join("");
      break;

    case 3:
      input = [ input[0], input[0], input[1], input[1], input[2], input[2] ].join("");
      break;

  }

  return [ "#", input ].join("");
  
}