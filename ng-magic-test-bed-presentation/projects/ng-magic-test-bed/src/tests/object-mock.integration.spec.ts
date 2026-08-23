import { NgMagicSetupTestBed } from '../public-api';

// Covers all 3 overloads of objectMock():
//   objectMock(objectClass, mock)                -> SpyObj<O> & M & O  (auto-spied from objectClass' prototype)
//   objectMock(objectClass, mock, dontSpy=true)   -> O & M              (no auto-spying)
//   objectMock(undefined, mock)                   -> SpyObj<M>          (no class to reflect on, spies mock's own methods)
//
// objectMock() never touches the DI container - use it for plain classes that
// are instantiated with "new" (e.g. by a factory), not @Injectable services.

class Widget {
    constructor(public readonly id: string) {}

    public activate(): void {
        // real implementation intentionally does something we don't want to run in tests
        throw new Error('should never run for a mock');
    }

    public isActive(): boolean {
        return false;
    }
}

describe('objectMock()', () => {

    it('should auto-spy every method found on the given class prototype', () => {
        const magic = new NgMagicSetupTestBed();
        const widgetMock = magic.objectMock(Widget, { id: 'mock-id' });

        widgetMock.isActive.and.returnValue(true);

        expect(widgetMock.id).toBe('mock-id');
        expect(widgetMock.isActive()).toBe(true);
        // activate() was never given a return value/implementation, but since it's
        // a spy now, calling it does NOT run the real (throwing) implementation:
        expect(() => widgetMock.activate()).not.toThrow();
        expect(widgetMock.activate).toHaveBeenCalled();
    });

    it('with dontSpy=true should return the mock unmodified - real methods still throw', () => {
        const magic = new NgMagicSetupTestBed();
        const widgetMock = magic.objectMock(Widget, { id: 'mock-id' }, true);

        expect(widgetMock.id).toBe('mock-id');
        expect(jasmine.isSpy((widgetMock as any).isActive)).toBe(false);
        // Since dontSpy=true, no methods were added or spied at all - isActive
        // does not even exist on the plain mock object:
        expect((widgetMock as any).isActive).toBeUndefined();
    });

    it('with objectClass=undefined and simple methods on a plain mock object are auto-spied', () => {
        const magic = new NgMagicSetupTestBed();
        const plainMock = magic.objectMock(undefined, {
            doSomething: () => 'done',
        });

        expect(plainMock.doSomething()).toBe('done');
        expect(jasmine.isSpy(plainMock.doSomething)).toBe(true);
    });

    it('should NOT register anything in the DI container', () => {
        const magic = new NgMagicSetupTestBed();
        magic.objectMock(Widget, { id: 'mock-id' });

        // Widget was never provided anywhere - injecting it directly is not
        // meaningful for objectMock() and would throw a NullInjectorError,
        // which is expected: objectMock() is for plain "new"-created objects.
        expect(() => magic.injection(Widget)).toThrow();
    });

});
