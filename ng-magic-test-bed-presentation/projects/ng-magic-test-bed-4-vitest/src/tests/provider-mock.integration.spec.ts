import { InjectionToken } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';
import { createSpy, isSpy } from '../spy-framework/spy-framework';

// Covers providerMock(token, mock, dontSpy?, spySource?)
// Use this for tokens that are NOT classes (e.g. InjectionToken-based providers).
// serviceMock() is the equivalent for classes.

// NOTE: spySource needs a class with REAL runtime prototype methods.
// A TypeScript "abstract" method has no function body and therefore no
// actual entry on the prototype at runtime, so it would not be picked up.
class Calculator {
    public add(a: number, b: number): number {return a+b}
    public subtract(a: number, b: number): number {return a-b}
}

const CALCULATOR = new InjectionToken<Calculator>('CALCULATOR');

describe('providerMock()', () => {

    it('Without a spySource, methods on mock object literal are auto-spied by default', () => {
        const magic = new NgMagicSetupTestBed();
        const calculatorMock = magic.providerMock(CALCULATOR, {
            add: ()=> 0,
            subtract: ()=> 0
        });


        expect(magic.injection<Calculator>(CALCULATOR)).toBe(calculatorMock);
        expect(isSpy(calculatorMock.add)).toBe(true);
        expect(isSpy(calculatorMock.subtract)).toBe(true);
        expect(calculatorMock.add(1,1)).toBe(0);
        expect(calculatorMock.subtract(4,1)).toBe(0);
    });

    it('correct pattern: pass spySource to get real auto-spying for a non-class token', () => {
        const magic = new NgMagicSetupTestBed();
        const calculatorMock = magic.providerMock(
            CALCULATOR,
            {
                add: () => 0
            },
            false,
            Calculator,
        );


        expect(magic.injection<Calculator>(CALCULATOR)).toBe(calculatorMock);
        expect(isSpy(calculatorMock.add)).toBe(true);
        expect(isSpy(calculatorMock.subtract)).toBe(true);
        expect(calculatorMock.add(1,1)).toBe(0);
        // auto spied method has no defined return value
        expect(calculatorMock.subtract(4,1)).toEqual(undefined as any);
    });

    it('alternative pattern: provide already-spied functions yourself when there is no class to use as spySource', () => {
        const magic = new NgMagicSetupTestBed();
        const calculatorMock = magic.providerMock(CALCULATOR, {
            add: createSpy('add', () => 100),
        });

        expect(magic.injection<Calculator>(CALCULATOR)).toBe(calculatorMock);
        expect(calculatorMock.add(1,1)).toBe(100);
        expect(calculatorMock.add).toHaveBeenCalledWith(1,1);
    });

    it('with dontSpy=true should use the mock exactly as given, regardless of spySource', () => {
        const magic = new NgMagicSetupTestBed();
        const calculatorMock = magic.providerMock(
            CALCULATOR,
            {
                  add: () => 0
               },
            true,
            Calculator,
        );

        expect(isSpy((calculatorMock.add))).toBe(false);
        expect(calculatorMock.add(1,1)).toBe(0);
        expect(calculatorMock.subtract).toBeUndefined();
    });

});
