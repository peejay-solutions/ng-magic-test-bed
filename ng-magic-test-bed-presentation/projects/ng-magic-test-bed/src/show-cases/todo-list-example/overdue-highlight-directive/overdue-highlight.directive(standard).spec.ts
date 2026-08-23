import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverdueHighlightDirective } from './overdue-highlight.directive';

@Component({
    selector: 'overdue-highlight-host',
    standalone: true,
    imports: [OverdueHighlightDirective],
    template: `<span [appOverdueHighlight]="dueDate">Todo</span>`,
})
class OverdueHighlightHostComponent {
    @Input() public dueDate: Date | null = null;
}

describe('OverdueHighlightDirective(standard)', () => {
    let fixture: ComponentFixture<OverdueHighlightHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [OverdueHighlightHostComponent],
        });
        fixture = TestBed.createComponent(OverdueHighlightHostComponent);
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
