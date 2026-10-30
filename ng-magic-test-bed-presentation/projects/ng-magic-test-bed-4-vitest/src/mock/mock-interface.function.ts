import { spyOnFunctionsOf } from '../spy-on-functions/spy-on-functions-of.function';
import { SpyObj } from '../spy-framework/spy-framework';

/**
 * Creates a mock object that satisfies the shape of a TypeScript interface I, without needing an NgMagicTestBed
 * instance. Standalone alternative to magic.interfaceMock(). This does not (and cannot) replace I anywhere -
 * interfaces have no runtime representation, so there is no prototype to reflect on the way mock() reflects on a
 * class. Only the methods you actually provide in mock become spies - nothing can be auto-generated for members
 * you omit, since there is nothing to reflect on for those either.
 * mock only has to be a Partial<I>, so omitted members are typed as present (I & SpyObj<I>) but do not
 * actually exist on the returned object - calling one you didn't provide throws at runtime despite compiling.
 * @param mock an object implementing whichever members of I you need for your test.
 * @param dontSpy optional parameter to prevent the default spy creation on the mock.
 * @returns your mock, typed as I & SpyObj<I>. Every method you provided is a spy that calls through to the
 * implementation you supplied, like mock() does.
 */
export function mockInterface<I>(mock: Partial<I>, dontSpy = false): I & SpyObj<I> {
    if (!dontSpy) {
        spyOnFunctionsOf(mock);
    }
    return <I & SpyObj<I>>mock;
}
