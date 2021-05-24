import { FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  // simply check the datepicker format matches digits in YYYY-DD-MM
  static songDate(control: FormControl): ValidationErrors | null {
    let DatePattern = /^\d{4}[./-]\d{2}[./-]\d{2}$/g;

    if(!control || control.value === null) return null;

    if (!control.value.match(DatePattern)) {
     return { "invalidDate": true };
    }

    return null;
  }
}
