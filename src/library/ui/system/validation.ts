export function validateInteger(e: Event): void {

  checkInput(e, /\D/);

}


export function validateNumber(e: Event): void {

  checkInput(e, /[^\+\-\d\.]/, /([\+\-]{2})|(\d*\.{1}\d*\.{1}\d*)|(\d[\+\-])/);

}


export function validatePositiveNumber(e: Event): void {

  checkInput(e, /[^\+\d\.]/, /([\+]{2})|(\d*\.{1}\d*\.{1}\d*)|(\d[\+])/);

}


export function validateNegativeNumber(e: Event): void {

  checkInput(e, /[^\-\d\.]/, /([\-]{2})|(\d*\.{1}\d*\.{1}\d*)|(\d[\-])/);

}



function checkInput(e: Event, keyCheck: RegExp, entryCheck?: RegExp): void {

  let input = "";

  if (e instanceof KeyboardEvent)
    input = e.key;

  else if (e instanceof ClipboardEvent)
    input = e.clipboardData?.getData("text") ?? "";



  if (keyCheck.test(input))
    e.preventDefault();


  if (entryCheck) {

    if (e.currentTarget instanceof HTMLInputElement && entryCheck.test(`${e.currentTarget.value}${input}`))
      e.preventDefault();
    
  }

}