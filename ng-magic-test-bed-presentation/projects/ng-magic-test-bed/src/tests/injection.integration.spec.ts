import { Injectable, InjectionToken } from '@angular/core';
import { NgMagicTestBed } from '../public-api';
import { makeSpyReturnValue } from '../spy-framework/spy-framework';

// Covers injection(token)
// Resolves anything from Angular's DI container. This is the method that
// finally triggers TestBed.configureTestingModule() - after calling it, no
// more mocks (serviceMock, objectMock, providerMock, ...) may be registered
// on this NgMagicTestBed instance.

@Injectable({ providedIn: 'root' })
class PlainService {
    public identify(): string {
        return 'real PlainService';
    }
}

const APP_NAME = new InjectionToken<string>('APP_NAME');

describe('injection()', () => {

    it('should resolve a real, unmocked @Injectable service', () => {
        const magic = new NgMagicTestBed();

        const service = magic.injection(PlainService);

        expect(service.identify()).toBe('real PlainService');
    });

    it('should resolve an arbitrary token such as an InjectionToken', () => {
        const magic = new NgMagicTestBed();
        magic.provider({ provide: APP_NAME, useValue: 'todo-app' });

        const appName = magic.injection(APP_NAME);

        expect(appName).toBe('todo-app');
    });

    it('should resolve a mock that was registered before injection() was called', () => {
        const magic = new NgMagicTestBed();
        const serviceMock = magic.serviceMock(PlainService);
        makeSpyReturnValue(serviceMock.identify, 'mocked');

        const service = magic.injection(PlainService);

        expect(service.identify()).toBe('mocked');
    });

    it('should throw if a mock is registered AFTER injection() has already configured the TestBed', () => {
        const magic = new NgMagicTestBed();
        magic.injection(PlainService);

        expect(() => magic.serviceMock(PlainService)).toThrowError(
            /has been implicitly configured/,
        );
    });

});
