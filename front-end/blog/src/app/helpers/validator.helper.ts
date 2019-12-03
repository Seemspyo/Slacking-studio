/** Native Modules */
import { FormControl, ValidatorFn } from '@angular/forms';


export function matchValidator(controlToMatch: () => FormControl): ValidatorFn {
    return (control): { mismatch: boolean } => {
        const matchingControl = controlToMatch();

        if (matchingControl && matchingControl.value !== control.value) return { mismatch: true }
        return null;
    }
}

export function multiPatternValidator(...regExps: Array<RegExp>): ValidatorFn {
    return (control): { multiPattern: boolean } => {
        if (regExps.every(regExp => !regExp.test(control.value))) return { multiPattern: true }
        return null;
    }
}