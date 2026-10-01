import { Type } from '@angular/core';

/**
 * An array of component or directive instances found inside the fixture, extended with two extras:
 * - mockClass: the class that was used to query the fixture's DOM for these instances. Use it directly
 *   with fixture.debugElement.query(By.directive(...)) whenever you need the DebugElement/nativeElement,
 *   at any point in your test - not just right after fixture() was called.
 * - requery(): re-runs the same query against the fixture's current DOM and rewrites this array in place
 *   with whatever it finds now. Does NOT call detectChanges() itself - call that first if you need it.
 */
export type MockArray<C> = Array<C> & {
    mockClass: Type<C>;
    requery(): void;
};
