import { generateUtilityClass } from '../generateUtilityClass';
import { generateUtilityClasses } from '../generateUtilityClasses';
export function getTabUtilityClass(slot) {
  return generateUtilityClass('MuiTab', slot);
}
export var tabClasses = generateUtilityClasses('MuiTab', ['root', 'selected', 'disabled']);