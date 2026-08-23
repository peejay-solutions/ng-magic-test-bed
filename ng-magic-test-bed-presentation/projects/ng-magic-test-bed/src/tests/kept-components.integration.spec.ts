import { Component, EventEmitter, Output } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';

// Covers keptComponents(componentClass)
//
// This is the trickiest method in the library and is NOT mentioned in
// llms.txt at all - this file exists specifically to close that gap.
//
// The problem it solves: a standalone component resolves the selectors used
// in ITS OWN template from ITS OWN "imports" array (set at @Component()
// decoration time), not from the global TestBed module config. So if you
// want to keep a component "real" (not mock it) while ALSO mocking one of
// ITS children two levels down, componentMocks()/serviceMock() alone cannot
// make that child-mock reachable from inside the kept component's template.
//
// keptComponents() solves this by calling TestBed.overrideComponent() and
// REPLACING (not merging!) the kept component's own "imports" array with
// everything this NgMagicSetupTestBed instance has collected so far via
// componentMocks()/directiveMocks()/keptDirectives()/keptPipe()/keptComponents().
//
// CAVEAT this test also documents: because it's a REPLACE and not a merge,
// any import the kept component needs that was NOT also registered through
// one of the methods above (e.g. CommonModule for *ngIf/*ngFor) would be
// silently dropped. Keep kept components' own templates simple, or make sure
// every one of their real imports is also "kept" explicitly.

@Component({
    selector: 'app-grandchild',
    standalone: true,
    template: `<button (click)="clicked.emit()">click</button>`,
})
class GrandchildComponent {
    @Output() public clicked = new EventEmitter<void>();
}

@Component({
    selector: 'app-middle',
    standalone: true,
    imports: [GrandchildComponent],
    template: `<app-grandchild (clicked)="onGrandchildClicked()"></app-grandchild>`,
})
class MiddleComponent {
    public receivedClick = false;

    public onGrandchildClicked(): void {
        this.receivedClick = true;
    }
}

@Component({
    selector: 'root-host',
    standalone: true,
    imports: [MiddleComponent],
    template: `<app-middle></app-middle>`,
})
class RootHostComponent {}

describe('keptComponents()', () => {

    function setup() {
        const magic = new NgMagicSetupTestBed();
        // Mock the innermost (grandchild) component...
        const grandchildMocks = magic.componentMocks(GrandchildComponent);
        // ...while keeping the middle component REAL, so its own logic
        // (onGrandchildClicked) actually runs:
        const middleInstances = magic.keptComponents(MiddleComponent);
        const fixture = magic.fixture(RootHostComponent);
        return { fixture, grandchildMocks, middleInstances };
    }

    it('should return the real MiddleComponent instance, not a mock', () => {
        const { middleInstances } = setup();

        expect(middleInstances.length).toBe(1);
        expect(middleInstances[0]).toBeInstanceOf(MiddleComponent);
    });

    it('should render the mocked GrandchildComponent inside the real MiddleComponent', () => {
        const { grandchildMocks } = setup();

        expect(grandchildMocks.length).toBe(1);
    });

    it('should let the real MiddleComponent react to events from its mocked grandchild', () => {
        const { middleInstances, grandchildMocks } = setup();

        grandchildMocks[0].clicked.emit();

        expect(middleInstances[0].receivedClick).toBe(true);
    });

});
