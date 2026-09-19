import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';

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

describe('componentMocks()', () => {

    it('before fixture() is called, the returned array is a placeholder, not empty/populated data', () => {
        const magic = new NgMagicSetupTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        expect(badgeMocks.length).toBe(1);
        expect(typeof badgeMocks[0]).toBe('string');
    });

    it('after fixture() the array is populated with one mock instance per rendered element', () => {
        const magic = new NgMagicSetupTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        magic.fixture(RootWithSingleBadgeComponent);

        expect(badgeMocks.length).toBe(1);
    });

    it('should map @Input()s onto the mock, including aliased inputs', () => {
        const magic = new NgMagicSetupTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        magic.fixture(RootWithSingleBadgeComponent);

        expect(badgeMocks[0].label).toBe('hello');
        expect(badgeMocks[0].color).toBe('red');
    });

    it('should map @Output()s onto the mock as real EventEmitters the parent can react to', () => {
        const magic = new NgMagicSetupTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        const fixture = magic.fixture(RootWithSingleBadgeComponent);
        badgeMocks[0].dismissed.emit();

        expect(fixture.componentInstance.wasDismissed).toBe(true);
    });

    it('should NOT execute the real component logic - only inputs/outputs are stubbed', () => {
        const magic = new NgMagicSetupTestBed();
        const badgeMocks = magic.componentMocks(BadgeComponent);

        const fixture = magic.fixture(RootWithSingleBadgeComponent);

        // The real BadgeComponent renders its label as text content - the mock
        // uses a generic "<ng-content></ng-content>" template instead, so the
        // real "{{ label }}" binding never runs:
        expect(fixture.nativeElement.textContent.trim()).toBe('');
        expect(badgeMocks[0].label).toBe('hello');
    });

});
