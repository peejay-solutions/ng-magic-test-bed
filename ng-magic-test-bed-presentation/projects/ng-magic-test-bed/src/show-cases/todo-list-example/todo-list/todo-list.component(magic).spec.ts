import { BehaviorSubject, of } from 'rxjs';
import { NgMagicSetupTestBed, mock } from '../../../public-api';
import { Todo } from '../todo-factory/todo.factory';
import { TodoItemComponent } from '../todo-item-component/todo-item.component';
import { TodoService } from '../todo-service/todo.service';
import { TodoListComponent } from './todo-list.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

describe('TodoListComponent(magic)', () => {
    function setup() {
        const magic = new NgMagicSetupTestBed();
        // componentMocks() replaces the REAL TodoItemComponent with an
        // auto-generated stub (same selector, same inputs/outputs) and
        // returns every rendered instance of it.
        const todoMocks = [
            magic.objectMock(Todo, {id: '1', done: false}),
            magic.objectMock(Todo, {id: '2', done: false}),
        ]
        magic.keptComponentImports([NgIf, NgFor, AsyncPipe])
        const todoItemMocks = magic.componentMocks(TodoItemComponent);
        const todoServiceMock = magic.serviceMock(TodoService,  {todos$: new BehaviorSubject<Array<Todo>>(todoMocks)});

        const fixture = magic.fixture(TodoListComponent);
        fixture.changeDetectorRef.detectChanges();
        return { fixture, todoMocks, todoItemMocks, todoServiceMock };
    }

    it('should render todos from todoService.todos$', async () => {
        const { fixture, todoServiceMock, todoItemMocks , todoMocks} = setup();

        expect(todoItemMocks.length).toBe(2);
        expect(todoItemMocks[0].todo).toEqual(todoMocks[0]);
        expect(todoItemMocks[1].todo).toEqual(todoMocks[1]);
    });

    it('should toggle a todo via the service when a todo item emits toggle', () => {
        const { fixture, todoServiceMock, todoItemMocks, todoMocks } = setup();
        fixture.detectChanges();

        todoItemMocks[0].toggle.emit(todoMocks[0]);

        expect(todoMocks[0].toggleDone).toHaveBeenCalled();
        expect(todoServiceMock.sendToggleDone).toHaveBeenCalledWith(todoMocks[0].id, false);
    });

});
