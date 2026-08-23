import { InputSignal, InputSignalWithTransform } from '@angular/core';

/**
 * @description
 * Unwraps a single property of a component class for use as a plain, settable value in fixture()'s
 * initialInputs:
 * - A signal input created via `input.required<T>()` or `input<T>()` (type `InputSignal<T>`) unwraps to `T`.
 * - A signal input created via `input(default, { transform })` (type `InputSignalWithTransform<T, W>`) unwraps
 *   to `W`, the type the transform function accepts - the same type `ComponentRef.setInput()` expects, since
 *   fixture() applies the transform itself (through setInput()), the same way Angular does for template bindings.
 * - Anything else (a classic `@Input() foo: T`, or any other property) is left unchanged.
 */
export type UnwrapInputSignal<V> =
    V extends InputSignalWithTransform<any, infer WriteT> ? WriteT :
    V extends InputSignal<infer ReadT> ? ReadT :
    V;

/**
 * @description
 * The type accepted by fixture()'s initialInputs parameter: every property of the component class,
 * with signal-based inputs (InputSignal/InputSignalWithTransform) unwrapped to the plain value they accept -
 * the same way you'd write them as a plain @Input() - and everything wrapped in Partial<>, since you're
 * not required to set every input up front.
 */
export type MagicFixtureInputs<C> = Partial<{
    [K in keyof C]: UnwrapInputSignal<C[K]>;
}>;
