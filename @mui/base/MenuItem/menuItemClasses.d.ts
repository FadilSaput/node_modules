export interface MenuItemClasses {
    /** Class name applied to the root element. */
    root: string;
    /** State class applied to the root `button` element if `disabled={true}`. */
    disabled: string;
    /** State class applied to the root `button` element if `focusVisible={true}`. */
    focusVisible: string;
}
export type MenuItemClassKey = keyof MenuItemClasses;
export declare function getMenuItemUtilityClass(slot: string): string;
export declare const menuItemClasses: MenuItemClasses;
