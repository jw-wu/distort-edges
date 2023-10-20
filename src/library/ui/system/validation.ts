export function validateInteger(e: Event): void {

  if (e instanceof KeyboardEvent && /\D/.test(e.key))
    e.preventDefault();

  else if (e instanceof ClipboardEvent) {

    let clipboardText = e.clipboardData?.getData("text");
    if (clipboardText && /\D/.test(clipboardText))
      e.preventDefault();

  }

}