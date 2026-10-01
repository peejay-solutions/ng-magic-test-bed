import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { By } from '@angular/platform-browser';
import { NgMagicTestBed } from '../public-api';

// Covers componentMocks(componentClass)
// Reflects componentClass's real @Input()/@Output() metadata and generates a
// stub component with the same selector. Must be called BEFORE fixture().
// The returned array is empty until fixture() has run.

@Component({
    selector: 'app-badge',
    standalone: true,
    template: `{{ label }}`,
})
class BadgeComponent {
    @Input({ required: true }) public label!: string;
    @Input('badgeColor') public color = 'grey';
    @Output() public dismissed = new EventEmitter<void>();
}

@Component({
    selector: 'root-with-single-badge',
    standalone: true,
    imports: [BadgeComponent],
    template: `<app-badge [label]="'hello'" [badgeColor]="'red'" (dismissed)="onDismiss()"></app-badge>`,
})
class RootWithSingleBadgeComponent {
    public wasDismissed = false;

    public onDismiss(): void {
        this.wasDismissed = true;
    }
}

@Component({
    selector: 'root-with-conditional-badge',
    standalone: true,
    imports: [BadgeComponent, NgIf],
    template: `<app-badge *ngIf="showBadge" [label]="'hello'"></app-badge>`,
})
class RootWithConditionalBadgeComponent {
    public showBadge = true;
}

describe('componentMocks()', () => {

    it('before fixture() is called, the returned array is a placeholder, not empty/populated data', () => {
        const magic = new NgMagicTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        expect(badgeMocks.length).toBe(1);
        expect(typeof badgeMocks[0]).toBe('string');
    });

    it('after fixture() the array is populated with one mock instance per rendered element', () => {
        const magic = new NgMagicTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        magic.fixture(RootWithSingleBadgeComponent);

        expect(badgeMocks.length).toBe(1);
    });

    it('should map @Input()s onto the mock, including aliased inputs', () => {
        const magic = new NgMagicTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        magic.fixture(RootWithSingleBadgeComponent);

        expect(badgeMocks[0].label).toBe('hello');
        expect(badgeMocks[0].color).toBe('red');
    });

    it('should map @Output()s onto the mock as real EventEmitters the parent can react to', () => {
        const magic = new NgMagicTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        const fixture = magic.fixture(RootWithSingleBadgeComponent);
        badgeMocks[0].dismissed.emit();

        expect(fixture.componentInstance.wasDismissed).toBe(true);
    });

    it('should NOT execute the real component logic - only inputs/outputs are stubbed', () => {
        const magic = new NgMagicTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        const fixture = magic.fixture(RootWithSingleBadgeComponent);

        // The real BadgeComponent renders its label as text content - the mock
        // uses a generic "<ng-content></ng-content>" template instead, so the
        // real "{{ label }}" binding never runs:
        expect(fixture.nativeElement.textContent.trim()).toBe('');
        expect(badgeMocks[0].label).toBe('hello');
    });

    it('mockClass exposes the auto-generated mock class, usable with fixture.debugElement.query(By.directive())', () => {
        const magic = new NgMagicTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        const fixture = magic.fixture(RootWithSingleBadgeComponent);
        const debugElement = fixture.debugElement.query(By.directive(badgeMocks.mockClass));

        // this is the whole point of mockClass: you never wrote/imported this class yourself,
        // yet you can still use the normal, readable By.directive() query API with it -
        // at any point in the test, not just right after fixture() ran.
        expect(debugElement).not.toBeNull();
        expect(debugElement.componentInstance).toBe(badgeMocks[0]);
    });

    it('requery() re-reads the fixture\'s current DOM in place, but does NOT call detectChanges() itself', () => {
        const magic = new NgMagicTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);
        magic.keptComponentImports([NgIf]); // RootWithConditionalBadgeComponent's *ngIf needs this, see keptComponentImports() docs

        const fixture = magic.fixture(RootWithConditionalBadgeComponent);
        expect(badgeMocks.length).toBe(1);

        fixture.componentInstance.showBadge = false;
        badgeMocks.requery();
        // detectChanges() has NOT run yet - the DOM itself hasn't changed, so requery() finds the same instance:
        expect(badgeMocks.length).toBe(1);

        fixture.changeDetectorRef.detectChanges();
        badgeMocks.requery();
        expect(badgeMocks.length).toBe(0);
    });

});
