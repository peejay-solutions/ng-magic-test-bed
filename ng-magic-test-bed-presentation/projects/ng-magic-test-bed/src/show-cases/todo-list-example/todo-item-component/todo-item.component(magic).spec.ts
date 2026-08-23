import { By } from '@angular/platform-browser';
import { NgMagicSetupTestBed } from '../../../public-api';
import { Todo } from '../todo-factory/todo.factory';
import { TodoItemComponent } from './todo-item.component';
import { AsyncPipe } from '@angular/common';

describe('TodoItemComponent(magic)', () => {

    function setup() {
        const magic = new NgMagicSetupTestBed();
        // This component is self-contained (its own pipe + directive), so
        // fixture() alone is enough - nothing to mock here.
        const todoMock = magic.objectMock(Todo, {
            id: '1', title: 'Buy milk', done: false, dueDate: null
        }); // Strong type using magic test bed. This is a SpyObj<Todo> as well as a Todo as well as a TodoMock
        const dueInPipeMock = magic.pipeMock('dueIn', value => value);
        magic.keptPipe(AsyncPipe);
        const fixture = magic.fixture(TodoItemComponent, { todo: todoMock });

        return { fixture, todoMock, dueInPipeMock };
    }

    it('should render the todo title', () => {
        const { fixture } = setup();
        const span = fixture.debugElement.query(By.css('span'));

        expect(span.nativeElement.textContent).toContain('Buy milk');
    });

    it('should emit toggle with the todo when the checkbox changes', () => {
        const { fixture, todoMock } = setup();
        const emitted: Todo[] = [];
        fixture.componentInstance.toggle.subscribe((value) => emitted.push(value));

        fixture.debugElement.query(By.css('input')).nativeElement.dispatchEvent(new Event('change'));

        expect(emitted).toEqual([todoMock]);
    });


});
