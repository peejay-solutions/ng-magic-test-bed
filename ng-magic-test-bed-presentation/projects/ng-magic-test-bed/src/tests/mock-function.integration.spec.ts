import { mock } from '../public-api';

// Covers the standalone mock(spySource?, mockObject?, dontSpy?) function.
// This is functionally IDENTICAL to magic.objectMock() (both end up calling
// the very same spyOnFunctionsOf() under the hood, and neither ever touches
// the DI container) - use the standalone version when you don't have (or
// don't want) an NgMagicSetupTestBed instance at all, e.g. inside a plain
// unit test for a class that manually "new"s its own dependencies.

class RealService {
    public doWork(input: string): string {
        return `real: ${input}`;
    }

    public other(): string {
        return 'real other';
    }
}

describe('mock()', () => {

    it('with a spySource class should auto-spy every method from its prototype', () => {
        const myMock = mock(RealService, { doWork: () => 'mocked' });

        expect(myMock.doWork('x')).toBe('mocked');
        expect(jasmine.isSpy(myMock.doWork)).toBe(true);
        // "other" was not in our mock object, but RealService's prototype has
        // it, so it still becomes a spy:
        expect(jasmine.isSpy(myMock.other)).toBe(true);
    });

    it('methods on a plain mock object literal are auto-spied', () => {
        const myMock = mock(undefined, { doWork: () => 'mocked' });

        expect(myMock.doWork()).toBe('mocked');
        expect(jasmine.isSpy(myMock.doWork)).toBe(true);
    });

    it('with dontSpy=true should return the mock exactly as given', () => {
        const myMock = mock(RealService, { doWork: () => 'mocked' }, true);

        expect(jasmine.isSpy(myMock.doWork)).toBe(false);
        expect((myMock as any).other).toBeUndefined();
    });

    it('should never register anything in the DI container', () => {
        const myMock = mock(RealService, { doWork: () => 'mocked' });

        // there is no NgMagicSetupTestBed instance involved at all here, so
        // there is nothing to inject from - this line just documents intent:
        expect(myMock).not.toBeInstanceOf(RealService);
    });

});
