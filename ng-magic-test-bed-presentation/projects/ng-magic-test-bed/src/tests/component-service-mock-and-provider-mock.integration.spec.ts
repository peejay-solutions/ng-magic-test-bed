import { Component, inject, Injectable, InjectionToken } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';

// Covers componentServiceMock() (all 3 overloads) and componentProviderMock().
// Use these when a service/token is provided at the COMPONENT level
// (`providers: [...]` inside @Component(), not the root injector).
// serviceMock()/providerMock() cannot reach these - the root TestBed
// injector never sees component-scoped providers.

@Injectable()
class ScopedCounterService {
    private count = 0;

    public increment(): number {
        return ++this.count;
    }
}

@Component({
    selector: 'counter-widget',
    standalone: true,
    providers: [ScopedCounterService],
    template: `{{ display }}`,
})
class CounterWidgetComponent {
    public display: number;

    constructor(private readonly counter: ScopedCounterService) {
        this.display = counter.increment();
    }
}

const WIDGET_ID = new InjectionToken<string>('WIDGET_ID');

@Component({
    selector: 'id-widget',
    standalone: true,
    providers: [{ provide: WIDGET_ID, useValue: 'real-id' }],
    template: `{{ id }}`,
})
class IdWidgetComponent {
    public id = inject(WIDGET_ID);
}

describe('componentServiceMock()', () => {

    it('with no mock argument should auto-spy the component-scoped service', () => {
        const magic = new NgMagicSetupTestBed();
        const counterMock = magic.componentServiceMock(CounterWidgetComponent, ScopedCounterService);
        counterMock.increment.and.returnValue(99);

        const fixture = magic.fixture(CounterWidgetComponent);

        expect(fixture.nativeElement.textContent.trim()).toBe('99');
    });

    it('with a partial mock should spy it and use the provided implementation', () => {
        const magic = new NgMagicSetupTestBed();
        const counterMock = magic.componentServiceMock(CounterWidgetComponent, ScopedCounterService, {
            increment: () => 7,
        });

        const fixture = magic.fixture(CounterWidgetComponent);

        expect(fixture.nativeElement.textContent.trim()).toBe('7');
        expect(counterMock.increment).toHaveBeenCalled();
    });

    it('with dontSpy=true should use the mock exactly as given', () => {
        const magic = new NgMagicSetupTestBed();
        const counterMock = magic.componentServiceMock(
            CounterWidgetComponent,
            ScopedCounterService,
            { increment: () => 7 },
            true,
        );

        const fixture = magic.fixture(CounterWidgetComponent);

        expect(fixture.nativeElement.textContent.trim()).toBe('7');
        expect(jasmine.isSpy(counterMock.increment)).toBe(false);
    });

});

describe('componentProviderMock()', () => {

    it('with a primitive mock and the default dontSpy=false, it throws - spyOnFunctionsOf needs an object', () => {
        const magic = new NgMagicSetupTestBed();

        expect(() => magic.componentProviderMock(IdWidgetComponent, WIDGET_ID, 'mocked-id')).toThrow();
    });

    it('with dontSpy=true, a primitive mock replaces the component-scoped token value', () => {
        const magic = new NgMagicSetupTestBed();
        magic.componentProviderMock(IdWidgetComponent, WIDGET_ID, 'mocked-id', true);

        const fixture = magic.fixture(IdWidgetComponent);

        expect(fixture.nativeElement.textContent.trim()).toBe('mocked-id');
    });

});
