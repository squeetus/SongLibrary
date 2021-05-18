import { FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  // simply check the datepicker format matches YYYY-DD-MM
  static songDate(control: FormControl): ValidationErrors | null {
    let DatePattern = /^\d{4}[./-]\d{2}[./-]\d{2}$/g;

    if (!control.value.match(DatePattern)) {
     return { "invalidDate": true };
    }

    return null;
  }
}
