import { NgMagicTestBed } from '../public-api';
import { isSpy, makeSpyReturnValue } from '../spy-framework/spy-framework';

// interfaceMock() mocks a TypeScript interface - a compile-time-only construct with no
// runtime representation. Unlike objectMock(objectClass, mock), there is no prototype to
// reflect on, so only the methods you actually provide in mock become spies - nothing is
// auto-generated for members you omit. mock only has to be a Partial<I>, so omitted members
// are typed as present on the result but do not exist at runtime.
//
// interfaceMock() never touches the DI container, just like objectMock(undefined, mock).

interface ILogger {
    info(message: string): void;
    warn(message: string): void;
}

describe('interfaceMock()', () => {

    it('should spy every method provided in the mock and call through to it', () => {
        const magic = new NgMagicTestBed();
        const loggerMock = magic.interfaceMock<ILogger>({
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
        const loggerMock = magic.interfaceMock<ILogger>({
            info: () => {},
            warn: () => {},
        }, true);

        expect(isSpy(loggerMock.info)).toBe(false);
        expect(isSpy(loggerMock.warn)).toBe(false);
    });

    it('should only create spys for the methods on the partial mock', ()=>{
        const magic = new NgMagicTestBed();
        const loggerMock = magic.interfaceMock<ILogger>({
            info: () => {},
        });

        expect(isSpy(loggerMock.info)).toBe(true);
        expect(isSpy(loggerMock.warn)).toBe(false);
    });

});
