import { inject, Injectable } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';
import { makeSpyReturnValue } from '../spy-framework/spy-framework';

// Covers run() and run(callback)
// Use this to instantiate plain classes (not @Injectable, not in DI) whose
// constructor or field initializers call inject() - inject() only works
// inside an active injection context, and run() opens exactly that, like
// TestBed.runInInjectionContext() does, while also (like injection())
// locking the TestBed configuration.

@Injectable({ providedIn: 'root' })
class GreeterService {
    public greet(): string {
        return 'real greeting';
    }
}

// Deliberately NOT @Injectable - a plain class that still needs DI.
class Greeting {
    private readonly greeter = inject(GreeterService);

    public build(): string {
        return this.greeter.greet();
    }
}

describe('run(callback)', () => {

    it('should execute the callback inside a valid injection context', () => {
        const magic = new NgMagicSetupTestBed();
        const greeterMock = magic.serviceMock(GreeterService);
        makeSpyReturnValue(greeterMock.greet, 'mocked greeting');

        const greeting = magic.run(() => new Greeting());

        expect(greeting.build()).toBe('mocked greeting');
    });

    it('should return whatever the callback returns', () => {
        const magic = new NgMagicSetupTestBed();

        const result = magic.run(() => 42);

        expect(result).toBe(42);
    });

    it('without run(), instantiating a class that calls inject() throws', () => {
        // No injection context is active here at all - this documents WHY
        // run() exists in the first place.
        expect(() => new Greeting()).toThrow();
    });

});

describe('run() without a callback', () => {

    it('should just configure the TestBed and return undefined', () => {
        const magic = new NgMagicSetupTestBed();

        const result = magic.run();

        expect(result).toBeUndefined();
    });

    it('should be safe to call multiple times (unlike fixture())', () => {
        const magic = new NgMagicSetupTestBed();

        expect(() => {
            magic.run();
            magic.run();
        }).not.toThrow();
    });

});
