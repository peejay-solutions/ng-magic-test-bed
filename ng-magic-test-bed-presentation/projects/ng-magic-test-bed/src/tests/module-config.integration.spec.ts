import { Component, CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';

// Covers: declaration(), declarations(), import(), imports(), provider(), providers(), schema(), schemas()
// These are the low-level module-config building blocks. All of them just push
// onto the underlying TestModuleMetadata before injection()/fixture() locks it in.

const GREETING = new InjectionToken<string>('GREETING');
const FAREWELL = new InjectionToken<string>('FAREWELL');

@Component({
    selector: 'declared-widget',
    standalone: false,
    template: `declared widget`,
})
class DeclaredWidgetComponent {}

@Component({
    selector: 'standalone-widget',
    standalone: true,
    template: `standalone widget`,
})
class StandaloneWidgetComponent {}

@Component({
    selector: 'root-with-declared-child',
    standalone: false,
    template: `<declared-widget></declared-widget>`,
})
class RootWithDeclaredChildComponent {}

@Component({
    selector: 'root-with-standalone-child',
    standalone: false,
    template: `<standalone-widget></standalone-widget>`,
})
class RootWithStandaloneChildComponent {}

@Component({
    selector: 'root-with-unknown-tag',
    standalone: true,
    template: `<some-custom-element></some-custom-element>`,
})
class RootWithUnknownTagComponent {}

describe('provider() / providers()', () => {

    it('provider() should register a single provider that injection() can resolve', () => {
        const magic = new NgMagicSetupTestBed();
        magic.provider({ provide: GREETING, useValue: 'hi' });

        expect(magic.injection(GREETING)).toBe('hi');
    });

    it('providers() should register several providers at once', () => {
        const magic = new NgMagicSetupTestBed();
        magic.providers([
            { provide: GREETING, useValue: 'hi' },
            { provide: FAREWELL, useValue: 'bye' },
        ]);

        expect(magic.injection(GREETING)).toBe('hi');
        expect(magic.injection(FAREWELL)).toBe('bye');
    });

});

describe('declaration() / declarations()', () => {

    it('declaration() should make a single non-standalone component usable in a fixture', () => {
        const magic = new NgMagicSetupTestBed();
        magic.declaration(DeclaredWidgetComponent);

        const fixture = magic.fixture(RootWithDeclaredChildComponent);

        expect(fixture.nativeElement.textContent).toContain('declared widget');
    });

    it('declarations() should accept several declarations at once', () => {
        const magic = new NgMagicSetupTestBed();
        magic.declarations([DeclaredWidgetComponent]);

        const fixture = magic.fixture(RootWithDeclaredChildComponent);

        expect(fixture.nativeElement.textContent).toContain('declared widget');
    });

});

describe('import() / imports()', () => {

    it('import() should make a single standalone component usable in a fixture', () => {
        const magic = new NgMagicSetupTestBed();
        magic.import(StandaloneWidgetComponent);

        const fixture = magic.fixture(RootWithStandaloneChildComponent);

        expect(fixture.nativeElement.textContent).toContain('standalone widget');
    });

    it('imports() should accept several imports at once', () => {
        const magic = new NgMagicSetupTestBed();
        magic.imports([StandaloneWidgetComponent]);

        const fixture = magic.fixture(RootWithStandaloneChildComponent);

        expect(fixture.nativeElement.textContent).toContain('standalone widget');
    });

});

describe('schema() / schemas()', () => {
    // fixture() adds NO_ERRORS_SCHEMA by default, which already silences unknown
    // elements. To actually exercise schema()/schemas() we disable that default
    // (see fixture.integration.spec.ts for more on disableNoErrorSchema) and add
    // CUSTOM_ELEMENTS_SCHEMA ourselves instead.

    it('schema() should add a single schema', () => {
        const magic = new NgMagicSetupTestBed();
        magic.schema(CUSTOM_ELEMENTS_SCHEMA);

        expect(() => magic.fixture(RootWithUnknownTagComponent, {}, true)).not.toThrow();
    });

    it('schemas() should accept several schemas at once', () => {
        const magic = new NgMagicSetupTestBed();
        magic.schemas([CUSTOM_ELEMENTS_SCHEMA]);

        expect(() => magic.fixture(RootWithUnknownTagComponent, {}, true)).not.toThrow();
    });

    it('without any schema and disableNoErrorSchema=true, an unknown element throws', () => {
          //Depending on angular version there is this flag or the schema needed
        const magic = new NgMagicSetupTestBed({errorOnUnknownElements: true});

        expect(() => magic.fixture(RootWithUnknownTagComponent, {}, true)).toThrow();
    });

});
