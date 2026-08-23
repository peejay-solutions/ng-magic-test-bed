import { Component, Input } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { NgMagicSetupTestBed } from '../../../public-api';
import { DueInPipe } from './due-in.pipe';

// A pipe has no template of its own, so it needs a small host component
// to be rendered through - the same pattern the library itself uses
// in tests/pipe-mock.integration.spec.ts.
@Component({
    selector: 'due-in-host',
    standalone: true,
    imports: [DueInPipe],
    template: `{{ dueDate | dueIn }}`,
})
class DueInHostComponent {
    @Input() public dueDate: Date | null = null;
}

describe('DueInPipe(magic)', () => {
    let fixture: ComponentFixture<DueInHostComponent>;

    beforeEach(() => {
        const magic = new NgMagicSetupTestBed();
        // keptPipe() keeps the REAL pipe in the template instead of stubbing
        // it - we want to test its actual transform() logic here.
        magic.keptPipe(DueInPipe);
        fixture = magic.fixture(DueInHostComponent);
    });

    it('should render an empty string when there is no due date', () => {
        fixture.componentInstance.dueDate = null;
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent.trim()).toBe('');
    });

    it('should render "due today" when the due date is today', () => {
        fixture.componentInstance.dueDate = new Date();
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent.trim()).toBe('due today');
    });

    it('should render "overdue" when the due date is in the past', () => {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        fixture.componentInstance.dueDate = yesterday;
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent.trim()).toBe('overdue');
    });

});
