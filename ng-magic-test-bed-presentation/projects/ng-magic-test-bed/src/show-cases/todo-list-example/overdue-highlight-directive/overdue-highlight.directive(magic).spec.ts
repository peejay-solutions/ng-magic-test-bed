import { Component, Input } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { NgMagicSetupTestBed } from '../../../public-api';
import { OverdueHighlightDirective } from './overdue-highlight.directive';

// A directive has no template of its own either - it needs a host component
// that actually uses the selector.
@Component({
    selector: 'overdue-highlight-host',
    standalone: true,
    imports: [OverdueHighlightDirective],
    template: `<span [appOverdueHighlight]="dueDate">Todo</span>`,
})
class OverdueHighlightHostComponent {
    @Input() public dueDate: Date | null = null;
}

describe('OverdueHighlightDirective(magic)', () => {
    let fixture: ComponentFixture<OverdueHighlightHostComponent>;

    beforeEach(() => {
        const magic = new NgMagicSetupTestBed();
        // keptDirectives() keeps the REAL directive - we want to test its
        // actual ngOnChanges() logic here, not mock it away.
        magic.keptDirectives(OverdueHighlightDirective);
        fixture = magic.fixture(OverdueHighlightHostComponent);
    });

    it('should not add the "overdue" class when there is no due date', () => {
        fixture.componentInstance.dueDate = null;
        fixture.detectChanges();
        const span: HTMLElement = fixture.nativeElement.querySelector('span');

        expect(span.classList.contains('overdue')).toBe(false);
    });

    it('should add the "overdue" class when the due date is in the past', () => {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        fixture.componentInstance.dueDate = yesterday;
        fixture.detectChanges();
        const span: HTMLElement = fixture.nativeElement.querySelector('span');

        expect(span.classList.contains('overdue')).toBe(true);
    });

});
