import { mockInterface } from '../public-api';
import { isSpy } from '../spy-framework/spy-framework';

// Covers the standalone mockInterface(mock, dontSpy?) function.
// This is functionally IDENTICAL to magic.interfaceMock() (neither ever touches the DI container) -
// use the standalone version when you don't have (or don't want) an NgMagicTestBed instance at all,
// e.g. inside a plain unit test for a class that manually "new"s its own dependencies.
// Like interfaceMock(), mock only has to be a Partial<I>: only the methods you provide become spies.

interface ILogger {
    info(message: string): void;
    warn(message: string): void;
}

describe('mockInterface()', () => {

    it('should spy every method provided in the mock and call through to it', () => {
        const loggerMock = mockInterface<ILogger>({
            info: () => {},
            warn: () => {},
        });

        loggerMock.info('hello');
        loggerMock.warn('careful');

        expect(isSpy(loggerMock.info)).toBe(true);
        expect(isSpy(loggerMock.warn)).toBe(true);
        expect(loggerMock.info).toHaveBeenCalledWith('hello');
        expect(loggerMock.warn).toHaveBeenCalledWith('careful');
    });

    it('with dontSpy=true should return the mock unmodified', () => {
        const loggerMock = mockInterface<ILogger>({
            info: () => {},
            warn: () => {},
        }, true);

        expect(isSpy(loggerMock.info)).toBe(false);
        expect(isSpy(loggerMock.warn)).toBe(false);
    });

    it('should only create spies for the methods on the partial mock', () => {
        const loggerMock = mockInterface<ILogger>({
            info: () => {},
        });

        expect(isSpy(loggerMock.info)).toBe(true);
        expect(isSpy(loggerMock.warn)).toBe(false);
    });

});
