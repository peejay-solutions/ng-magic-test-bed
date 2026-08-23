import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Todo } from '../todo-factory/todo.factory';
import { TodoItemComponent } from './todo-item.component';



describe('TodoItemComponent(standard)', () => {
    let fixture!: ComponentFixture<TodoItemComponent>;
    let todoMock: any; // Weak type when using standard test bed

    beforeEach(() =>  {
        todoMock = {id: '1', title: 'Buy milk', done: false,dueTime: null};

        TestBed.configureTestingModule({
            imports: [TodoItemComponent],
        });
        fixture = TestBed.createComponent(TodoItemComponent);
        fixture.componentInstance.todo = todoMock
        fixture.detectChanges();
    });

    it('should render the todo title', () => {
        const span = fixture.debugElement.query(By.css('span'));

        expect(span.nativeElement.textContent).toContain('Buy milk');
    });

    it('should emit toggle with the todo when the checkbox changes', () => {
        const emitted: Todo[] = [];
        fixture.componentInstance.toggle.subscribe((value) => emitted.push(value));

        fixture.debugElement.query(By.css('input')).nativeElement.dispatchEvent(new Event('change'));

        expect(emitted).toEqual([todoMock]);
    });


});
