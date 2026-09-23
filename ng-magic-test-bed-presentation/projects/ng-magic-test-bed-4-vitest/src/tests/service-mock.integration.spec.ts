import { Injectable } from '@angular/core';
import { NgMagicTestBed } from '../public-api';
import { isSpy, makeSpyReturnValue } from '../spy-framework/spy-framework';

// Covers all 3 overloads of serviceMock():
//   serviceMock(ServiceClass)                    -> SpyObj<S>
//   serviceMock(ServiceClass, mock)               -> SpyObj<S> & M   (methods spied AND call through to mock)
//   serviceMock(ServiceClass, mock, dontSpy=true)  -> S & M           (no auto-spying at all)

@Injectable({ providedIn: 'root' })
class GreeterService {
    public greet(name: string): string {
        return `Hello, ${name}!`;
    }

    public farewell(name: string): string {
        return `Bye, ${name}!`;
    }
}

describe('serviceMock()', () => {

    it('with no mock argument should return a full auto-spy - every prototype method becomes a spy', () => {
        const magic = new NgMagicTestBed();
        const greeterMock = magic.serviceMock(GreeterService);

        makeSpyReturnValue(greeterMock.greet, 'mocked greeting');

        expect(greeterMock.greet('World')).toBe('mocked greeting');
        expect(greeterMock.greet).toHaveBeenCalledWith('World');
        // farewell was never given a return value, but it still IS a spy:
        expect(isSpy(greeterMock.farewell)).toBe(true);
    });

    it('with a partial mock should still spy every prototype method (yours and the auto-added ones)', () => {
        const magic = new NgMagicTestBed();
        const greeterMock = magic.serviceMock(GreeterService, {
            greet: (name: string) => `Hi, ${name}`,
        });

        expect(greeterMock.greet('Ada')).toBe('Hi, Ada');
        expect(greeterMock.greet).toHaveBeenCalledWith('Ada');
        // farewell was not provided in the mock, but serviceMock() still added a spy for it
        // (auto-spied from GreeterService's prototype):
        expect(isSpy(greeterMock.farewell)).toBe(true);
    });

    it('with dontSpy=true should use the mock exactly as given - no auto-spies added', () => {
        const magic = new NgMagicTestBed();
        const greeterMock = magic.serviceMock(
            GreeterService,
            { greet: (name: string) => `Hi, ${name}` },
            true,
        );

        expect(greeterMock.greet('Ada')).toBe('Hi, Ada');
        // Because dontSpy=true, greet() is a plain function - NOT a spy:
        expect(isSpy(greeterMock.greet)).toBe(false);
        // and farewell was never added at all, since it wasn't in the mock and
        // dontSpy=true skips auto-spying the rest of the prototype:
        expect((greeterMock as any).farewell).toBeUndefined();
    });

    it('should register the mock in the DI container, replacing the real service', () => {
        const magic = new NgMagicTestBed();
        const greeterMock = magic.serviceMock(GreeterService);
        makeSpyReturnValue(greeterMock.greet, 'mocked');

        const injectedGreeter = magic.injection(GreeterService);

        expect(injectedGreeter).toBe(greeterMock);
        expect(injectedGreeter.greet('World')).toBe('mocked');
    });

});
