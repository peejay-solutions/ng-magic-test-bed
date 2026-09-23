import { NgMagicTestBed } from '../public-api';
import { isSpy, makeSpyReturnValue } from '../spy-framework/spy-framework';

// interfaceMock() mocks a TypeScript interface - a compile-time-only construct with no
// runtime representation. Unlike objectMock(objectClass, mock), there is no prototype to
// reflect on, so mock must implement every member of the interface - only the methods you
// actually provide become spies, nothing is auto-generated for members you'd omit (and the
// compiler won't let you omit any, since mock is typed as I, not Partial<I>).
//
// interfaceMock() never touches the DI container, just like objectMock(undefined, mock).

interface Logger {
    info(message: string): void;
    warn(message: string): void;
}

describe('interfaceMock()', () => {

    it('should spy every method provided in the mock and call through to it', () => {
        const magic = new NgMagicTestBed();
        const loggerMock = magic.interfaceMock<Logger>({
            info: () => {},
            warn: () => {},
        });

        makeSpyReturnValue(loggerMock.info, undefined);

        loggerMock.info('hello');
        loggerMock.warn('careful');

        expect(isSpy(loggerMock.info)).toBe(true);
        expect(isSpy(loggerMock.warn)).toBe(true);
        expect(loggerMock.info).toHaveBeenCalledWith('hello');
        expect(loggerMock.warn).toHaveBeenCalledWith('careful');
    });

    it('with dontSpy=true should return the mock unmodified', () => {
        const magic = new NgMagicTestBed();
        const loggerMock = magic.interfaceMock<Logger>({
            info: () => {},
            warn: () => {},
        }, true);

        expect(isSpy(loggerMock.info)).toBe(false);
        expect(isSpy(loggerMock.warn)).toBe(false);
    });

});
