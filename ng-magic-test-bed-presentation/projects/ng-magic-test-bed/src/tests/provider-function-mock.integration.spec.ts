import { InjectionToken } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';

// Covers providerFunctionMock(token, callback?)
// Use this when a provider token resolves to a plain FUNCTION rather than a
// class instance (e.g. a factory-provided utility function).

const FORMAT_CURRENCY = new InjectionToken<(value: number) => string>('FORMAT_CURRENCY');

describe('providerFunctionMock()', () => {

    it('without a callback should return a spy that returns undefined by default', () => {
        const magic = new NgMagicSetupTestBed();
        const formatCurrencyMock = magic.providerFunctionMock(FORMAT_CURRENCY);

        const injectedFn = magic.injection(FORMAT_CURRENCY);

        expect(injectedFn).toBe(formatCurrencyMock as any);
        expect(injectedFn(9.99)).toBeUndefined();
        expect(formatCurrencyMock).toHaveBeenCalledWith(9.99);
    });

    it('with a callback should use it as the default behavior of the spy', () => {
        const magic = new NgMagicSetupTestBed();
        const formatCurrencyMock = magic.providerFunctionMock(
            FORMAT_CURRENCY,
            (value: number) => `$${value.toFixed(2)}`,
        );

        const injectedFn = magic.injection(FORMAT_CURRENCY);

        expect(injectedFn(9.9)).toBe('$9.90');
        expect(formatCurrencyMock).toHaveBeenCalledWith(9.9);
    });

    it('the returned spy can still have its behavior overridden per test', () => {
        const magic = new NgMagicSetupTestBed();
        const formatCurrencyMock = magic.providerFunctionMock(
            FORMAT_CURRENCY,
            (value: number) => `$${value.toFixed(2)}`,
        );
        formatCurrencyMock.and.returnValue('overridden');

        const injectedFn = magic.injection(FORMAT_CURRENCY);

        expect(injectedFn(1)).toBe('overridden');
    });

});
