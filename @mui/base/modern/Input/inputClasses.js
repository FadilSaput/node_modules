import { generateUtilityClass } from '../generateUtilityClass';
import { generateUtilityClasses } from '../generateUtilityClasses';
export function getInputUtilityClass(slot) {
  return generateUtilityClass('MuiInput', slot);
}
export const inputClasses = generateUtilityClasses('MuiInput', ['root', 'formControl', 'focused', 'disabled', 'error', 'multiline', 'input', 'inputMultiline', 'inputTypeSearch', 'adornedStart', 'adornedEnd']);