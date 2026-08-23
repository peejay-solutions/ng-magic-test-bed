import { Component, Directive, ElementRef, Injectable, InjectionToken, inject } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';
import { TestBed } from '@angular/core/testing';

// Covers directiveServiceMock() (all 3 overloads) and directiveProviderMock().
// Same idea as componentServiceMock()/componentProviderMock(), but for
// services/tokens provided at the DIRECTIVE level.

@Injectable()
class ScopedLabelService {
    public getLabel(): string {
        return 'real label';
    }
}

@Directive({
    selector: '[labelWidget]',
    standalone: true,
    providers: [ScopedLabelService],
})
class LabelWidgetDirective {
    constructor(private readonly el: ElementRef<HTMLElement>, private readonly labelService: ScopedLabelService) {
        this.el.nativeElement.textContent = this.labelService.getLabel();
    }
}

@Component({
    selector: 'label-host',
    standalone: true,
    imports: [LabelWidgetDirective],
    template: `<span labelWidget></span>`,
})
class LabelHostComponent {}

const LABEL_PREFIX = new InjectionToken<string>('LABEL_PREFIX');

@Directive({
    selector: '[prefixedLabel]',
    standalone: true,
    providers: [{ provide: LABEL_PREFIX, useValue: 'real-prefix: ' }],
})
class PrefixedLabelDirective {
    constructor(private readonly el: ElementRef<HTMLElement>) {
        const prefix = inject(LABEL_PREFIX);
        this.el.nativeElement.textContent = `${prefix}label`;
    }
}

@Component({
    selector: 'prefixed-label-host',
    standalone: true,
    imports: [PrefixedLabelDirective],
    template: `<span prefixedLabel></span>`,
})
class PrefixedLabelHostComponent {}

describe('directiveServiceMock()', () => {
    it('with no mock argument should auto-spy the directive-scoped service', async () => {
        const magic = new NgMagicSetupTestBed();
        magic.keptDirectives(LabelWidgetDirective);
        const labelServiceMock = magic.directiveServiceMock(LabelWidgetDirective, ScopedLabelService);
        labelServiceMock.getLabel.and.returnValue('mocked label');

        const fixture = magic.fixture(LabelHostComponent);

        expect(fixture.nativeElement.querySelector('span').textContent).toBe('mocked label');
    });

    it('with a partial mock should spy it and use the provided implementation', () => {
        const magic = new NgMagicSetupTestBed();
        magic.keptDirectives(LabelWidgetDirective);
        const labelServiceMock = magic.directiveServiceMock(LabelWidgetDirective, ScopedLabelService, {
            getLabel: () => 'custom label',
        });

        const fixture = magic.fixture(LabelHostComponent);

        expect(fixture.nativeElement.querySelector('span').textContent).toBe('custom label');
        expect(labelServiceMock.getLabel).toHaveBeenCalled();
    });

    it('with dontSpy=true should use the mock exactly as given', () => {
        const magic = new NgMagicSetupTestBed();
        magic.keptDirectives(LabelWidgetDirective);
        const labelServiceMock = magic.directiveServiceMock(
            LabelWidgetDirective,
            ScopedLabelService,
            { getLabel: () => 'custom label' },
            true,
        );

        magic.fixture(LabelHostComponent);

        expect(jasmine.isSpy(labelServiceMock.getLabel)).toBe(false);
    });
});


describe('directiveProviderMock()', () => {

    it('with a primitive mock and the default dontSpy=false, it throws', () => {
        const magic = new NgMagicSetupTestBed();
        magic.keptDirectives(PrefixedLabelDirective);

        expect(() => magic.directiveProviderMock(PrefixedLabelDirective, LABEL_PREFIX, 'mocked-prefix: ')).toThrow();
    });

    it('with dontSpy=true, a primitive mock replaces the directive-scoped token value', () => {
        const magic = new NgMagicSetupTestBed();
        magic.keptDirectives(PrefixedLabelDirective);
        magic.directiveProviderMock(PrefixedLabelDirective, LABEL_PREFIX, 'mocked-prefix: ', true);

        const fixture = magic.fixture(PrefixedLabelHostComponent);

        expect(fixture.nativeElement.querySelector('span').textContent).toBe('mocked-prefix: label');
    });

});
