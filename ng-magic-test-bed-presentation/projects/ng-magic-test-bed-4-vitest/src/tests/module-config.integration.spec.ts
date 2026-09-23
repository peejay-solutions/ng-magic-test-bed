import { Component, CUSTOM_ELEMENTS_SCHEMA, InjectionToken, NgModule } from '@angular/core';
import { NgMagicTestBed } from '../public-api';

// Covers: declaration(), declarations(), import(), imports(), provider(), providers(), schema(), schemas()
// These are the low-level module-config building blocks. All of them just push
// onto the underlying TestModuleMetadata before injection()/fixture() locks it in.

const GREETING = new InjectionToken<string>('GREETING');
const FAREWELL = new InjectionToken<string>('FAREWELL');

@Component({
    selector: 'declared-child',
    standalone: false,
    template: `declared child`,
})
class DeclaredChildComponent {}

@Component({
    selector: 'standalone-child',
    standalone: true,
    template: `standalone child`,
})
class StandaloneChildComponent {}

@Component({
    selector: 'declared-root-with-declared-child',
    standalone: false,
    template: `<declared-child></declared-child>`,
})
class DeclaredRootWithDeclaredChildComponent {}

@Component({
    selector: 'declared-root-with-standalone-child',
    standalone: false,
    template: `<standalone-child></standalone-child>`,
})
class DeclaredRootWithStandaloneChildComponent {}

@Component({
    selector: 'standalone-root-with-unknown-tag',
    standalone: true,
    template: `<standalone-child></standalone-child>`,
    imports: [StandaloneChildComponent]
})
class StandaloneRootWithStandaloneChildComponent {}

@NgModule({
    imports: [StandaloneChildComponent],
    declarations: [
        DeclaredChildComponent, 
        DeclaredRootWithStandaloneChildComponent, 
        DeclaredRootWithDeclaredChildComponent
    ]
})
class MyNgModule{
}

describe('provider() / providers()', () => {

    it('provider() should register a single provider that injection() can resolve', () => {
        const magic = new NgMagicTestBed();
        magic.provider({ provide: GREETING, useValue: 'hi' });

        expect(magic.injection(GREETING)).toBe('hi');
    });

    it('providers() should register several providers at once', () => {
        const magic = new NgMagicTestBed();
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
        const magic = new NgMagicTestBed();
        magic.declaration(DeclaredChildComponent);

        const fixture = magic.fixture(DeclaredRootWithDeclaredChildComponent);

        expect(fixture.nativeElement.textContent).toContain('declared child');
    });

    it('declarations() should accept several declarations at once', () => {
        const magic = new NgMagicTestBed();
        magic.declarations([DeclaredChildComponent]);

        const fixture = magic.fixture(DeclaredRootWithDeclaredChildComponent);

        expect(fixture.nativeElement.textContent).toContain('declared child');
    });

});

describe('import() / imports()', () => {

    it('import() should make a single standalone component usable in a fixture', () => {
        const magic = new NgMagicTestBed();
        magic.import(StandaloneChildComponent);

        const fixture = magic.fixture(DeclaredRootWithStandaloneChildComponent);

        expect(fixture.nativeElement.textContent).toContain('standalone child');
    });

    it('imports() should accept several imports at once', () => {
        const magic = new NgMagicTestBed();
        magic.imports([StandaloneChildComponent]);

        const fixture = magic.fixture(DeclaredRootWithStandaloneChildComponent);

        expect(fixture.nativeElement.textContent).toContain('standalone child');
    });

});

describe('schema() / schemas()', () => {
    // fixture() adds NO_ERRORS_SCHEMA by default, which already silences unknown
    // elements. To actually exercise schema()/schemas() we disable that default
    // (see fixture.integration.spec.ts for more on disableNoErrorSchema) and add
    // CUSTOM_ELEMENTS_SCHEMA ourselves instead.

    it('schema() should add a single schema', () => {
        const magic = new NgMagicTestBed();
        magic.schema(CUSTOM_ELEMENTS_SCHEMA);

        expect(() => magic.fixture(StandaloneRootWithStandaloneChildComponent, {}, true)).not.toThrow();
    });

    it('schemas() should accept several schemas at once', () => {
        const magic = new NgMagicTestBed();
        magic.schemas([CUSTOM_ELEMENTS_SCHEMA]);

        expect(() => magic.fixture(StandaloneRootWithStandaloneChildComponent, {}, true)).not.toThrow();
    });

    it('without any schema and disableNoErrorSchema=true, an unknown element throws', () => {
          //Depending on angular version there is this flag or the schema needed
        const magic = new NgMagicTestBed({errorOnUnknownElements: true});

        expect(() => magic.fixture(StandaloneRootWithStandaloneChildComponent, {}, true)).toThrow();
    });

});
