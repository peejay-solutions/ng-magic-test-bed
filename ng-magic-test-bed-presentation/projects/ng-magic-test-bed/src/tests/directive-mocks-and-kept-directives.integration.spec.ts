import { Component, Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { NgMagicTestBed } from '../public-api';

// Covers directiveMocks(directiveClass) and keptDirectives(directiveClass).
//
// Unlike componentMocks(), directiveMocks() does NOT auto-generate a stub for
// you (Angular has no public API to reflect a directive's inputs/outputs the
// way it does for components). Instead directiveMocks() just puts whatever
// class you pass it into the fixture and returns its rendered instances.
// That means:
//   - pass the REAL directive class -> you get real instances (this is
//     exactly what keptDirectives() is for/does - it is a plain alias).
//   - pass your OWN hand-written stub class with the same selector -> that
//     is how you actually "mock" a directive with this library.

@Directive({
    selector: '[appHighlight]',
    standalone: true,
})
class HighlightDirective implements OnChanges {
    @Input('appHighlight') public color = 'yellow';

    constructor(private readonly el: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {}

    public ngOnChanges(): void {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.color);
    }
}

@Directive({
    selector: '[appHighlight]',
    standalone: true,
})
class HighlightDirectiveStub {
    @Input('appHighlight') public color = 'yellow';
    public wasBound = false;

    constructor() {
        this.wasBound = true;
    }
}

@Component({
    selector: 'highlight-host',
    standalone: true,
    imports: [HighlightDirective],
    template: `<span [appHighlight]="'lime'">text</span>`,
})
class HighlightHostComponent {}

@Component({
    selector: 'highlight-host-with-stub',
    standalone: true,
    imports: [HighlightDirectiveStub],
    template: `<span [appHighlight]="'lime'">text</span>`,
})
class HighlightHostWithStubComponent {}

describe('keptDirectives() - keeping the REAL directive', () => {

    it('should return the real, fully functional directive instances after fixture()', () => {
        const magic = new NgMagicTestBed();
        const highlightInstances = magic.keptDirectives(HighlightDirective);

        const fixture = magic.fixture(HighlightHostComponent);
        const span: HTMLElement = fixture.nativeElement.querySelector('span');

        expect(highlightInstances.length).toBe(1);
        expect(highlightInstances[0]).toBeInstanceOf(HighlightDirective);
        expect(span.style.backgroundColor).toBe('lime');
    });

});

describe('directiveMocks() - using it with a hand-written stub to actually mock a directive', () => {

    it('should render the stub instead of the real directive when the stub uses the same selector', () => {
        const magic = new NgMagicTestBed();
        const highlightStubInstances = magic.directiveMocks(HighlightDirectiveStub);

        const fixture = magic.fixture(HighlightHostWithStubComponent);
        const span: HTMLElement = fixture.nativeElement.querySelector('span');

        expect(highlightStubInstances.length).toBe(1);
        expect(highlightStubInstances[0].wasBound).toBe(true);
        // the stub does not implement the real highlighting logic, so no style is applied:
        expect(span.style.backgroundColor).toBe('');
    });

});

describe('directiveMocks() and keptDirectives() are functionally identical', () => {

    it('directiveMocks(RealClass) behaves exactly like keptDirectives(RealClass)', () => {
        const magic = new NgMagicTestBed();
        const highlightInstances = magic.directiveMocks(HighlightDirective);

        const fixture = magic.fixture(HighlightHostComponent);
        const span: HTMLElement = fixture.nativeElement.querySelector('span');

        expect(highlightInstances.length).toBe(1);
        expect(span.style.backgroundColor).toBe('lime');
    });

});
