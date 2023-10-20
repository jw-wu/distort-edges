// Checks if the input is a number and returns result.
export function getNumber(input: string): number | null {

  if (!isNaN(Number(input))) return Math.round(Number(input));
  else return null;

}


// Checks if input is padding-formatted and returns result.
export function getPadding(parameters: ParameterValues): number[ ] {

  // Top, right, bottom, left padding values.
  let padding: number[] = [ ];

  // If there is input.
  if (parameters.padding!) {

    // Split the input into individual values.
    let paddingSplit: number[] = parameters.padding
      .replace(/\s/g, "")
      .split(",")
      .map((str: string) => Number(str));

    // Loop through individual values.
    for (let paddingValue of paddingSplit) {
      if (Number.isNaN(paddingValue)) {
        figma.notify("Padding needs to be a number.", { timeout: 5000, error: true });
        figma.closePlugin();
      }
    }

    // Map padding values to padding array.
    switch(paddingSplit.length) {
      case 1:
        padding = [ paddingSplit[0], paddingSplit[0], paddingSplit[0], paddingSplit[0] ];
        break;

      case 2:
        padding = [ paddingSplit[0], paddingSplit[1], paddingSplit[0], paddingSplit[1] ];
        break;

      case 3:
        padding = [ paddingSplit[0], paddingSplit[1], paddingSplit[2], paddingSplit[1] ];
        break;

      case 4:
        padding = [ paddingSplit[0], paddingSplit[1], paddingSplit[2], paddingSplit[3] ];
        break;

      default:
        figma.notify("The plugin accepts up to 4 values for padding.", { timeout: 5000, error: true });
        figma.closePlugin();
    }
  }

  // If there is no input.
  else padding = [ 0, 0, 0, 0 ];

  return padding;
  
}