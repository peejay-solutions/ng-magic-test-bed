import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DueInPipe } from './due-in.pipe';

@Component({
    selector: 'due-in-host',
    standalone: true,
    imports: [DueInPipe],
    template: `{{ dueDate | dueIn }}`,
})
class DueInHostComponent {
    @Input() public dueDate: Date | null = null;
}

describe('DueInPipe(standard)', () => {
    let fixture: ComponentFixture<DueInHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DueInHostComponent],
        });
        fixture = TestBed.createComponent(DueInHostComponent);
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
