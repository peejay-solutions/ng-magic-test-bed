import { booleanAttribute, Component, input, Input } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';

// Covers fixture(componentClass, initialInputs?, disableNoErrorSchema?)

@Component({
    selector: 'input-widget',
    standalone: true,
    template: `{{ label }} - {{ count }}`,
})
class InputWidgetComponent {
    @Input() public label = 'default';
    @Input() public count = 0;
}

@Component({
    selector: 'signal-input-widget',
    standalone: true,
    template: `{{ label() }} - {{ count() }} - {{ disabled() }}`,
})
class SignalInputWidgetComponent {
    public label = input('default');
    public count = input(0);
    public disabled = input(false, { transform: booleanAttribute });
}

@Component({
    selector: 'unknown-child-host',
    standalone: true,
    template: `<not-a-real-component></not-a-real-component>`,
})
class UnknownChildHostComponent {}

describe('fixture() - initialInputs', () => {

    it('should apply given inputs to the component instance before the first detectChanges()', () => {
        const magic = new NgMagicSetupTestBed();

        const fixture = magic.fixture(InputWidgetComponent, { label: 'custom', count: 5 });

        expect(fixture.componentInstance.label).toBe('custom');
        expect(fixture.nativeElement.textContent.trim()).toBe('custom - 5');
    });

    it('without initialInputs the component keeps using its own default values', () => {
        const magic = new NgMagicSetupTestBed();

        const fixture = magic.fixture(InputWidgetComponent);

        expect(fixture.nativeElement.textContent.trim()).toBe('default - 0');
    });

});

describe('fixture() - initialInputs with signal-based input()', () => {

    it('should apply given values to signal inputs before the first detectChanges()', () => {
        const magic = new NgMagicSetupTestBed();

        const fixture = magic.fixture(SignalInputWidgetComponent, { label: 'custom', count: 5 });

        expect(fixture.componentInstance.label()).toBe('custom');
        expect(fixture.nativeElement.textContent.trim()).toBe('custom - 5 - false');
    });

    it('without initialInputs the component keeps using its own default signal values', () => {
        const magic = new NgMagicSetupTestBed();

        const fixture = magic.fixture(SignalInputWidgetComponent);

        expect(fixture.nativeElement.textContent.trim()).toBe('default - 0 - false');
    });

    it('should apply the transform for a signal input declared with input(default, { transform })', () => {
        const magic = new NgMagicSetupTestBed();

        // disabled's transform is booleanAttribute - the empty string '' is the value an attribute
        // binding like [disabled]="" would produce, and booleanAttribute treats it as true.
        const fixture = magic.fixture(SignalInputWidgetComponent, { disabled: '' });

        expect(fixture.componentInstance.disabled()).toBe(true);
    });

});

describe('fixture() - disableNoErrorSchema', () => {

    it('by default (disableNoErrorSchema=false), an unknown child element does not throw', () => {
        const magic = new NgMagicSetupTestBed();

        expect(() => magic.fixture(UnknownChildHostComponent)).not.toThrow();
    });

    it('with disableNoErrorSchema=true, an unknown child element throws', () => {
        //Depending on angular version there is this flag or the schema needed
        const magic = new NgMagicSetupTestBed({errorOnUnknownElements: true});

        expect(() => magic.fixture(UnknownChildHostComponent, {}, true)).toThrow();
    });

});

describe('fixture() - can only be called once per instance', () => {

    it('should throw when called a second time on the same NgMagicSetupTestBed instance', () => {
        const magic = new NgMagicSetupTestBed();
        magic.fixture(InputWidgetComponent);

        expect(() => magic.fixture(InputWidgetComponent)).toThrowError(
            '.fixture can only be called once per NgMagicTestBed instance',
        );
    });

});
