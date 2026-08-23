import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { Todo } from '../todo-factory/todo.factory';
import { TodoItemComponent } from '../todo-item-component/todo-item.component';
import { TodoService } from '../todo-service/todo.service';
import { TodoListComponent } from './todo-list.component';

describe('TodoListComponent(standard)', () => {


    let fixture: ComponentFixture<TodoListComponent>;
    let todoServiceMock: TodoServiceMock;
    let todoItemMocks: Array<TodoItemComponent>;
    let todoMocks: Array<jasmine.SpyObj<TodoMock & Todo>>;



    beforeEach(() => {
        todoServiceMock = new TodoServiceMock();
        todoMocks = [
            new TodoMock('1') as any,
            new TodoMock('2') as any
        ]
        todoServiceMock.todos$.next(todoMocks as Array<any>)
        TestBed.configureTestingModule({
            imports: [TodoListComponent],
            providers: [
                { provide: TodoService, useValue: todoServiceMock },
            ],
        });
        // Manually swap the real child component for our stub, because
        // TodoListComponent imports it directly (it is standalone).
        TestBed.overrideComponent(TodoListComponent, {
            remove: { imports: [TodoItemComponent] },
            add: { imports: [TodoItemComponentStub] },
        });
     
        fixture = TestBed.createComponent(TodoListComponent);
        fixture.detectChanges();
        todoItemMocks = fixture.debugElement
            .queryAll(By.directive(TodoItemComponentStub))
            .map((debugElement) => debugElement.componentInstance);

    });


  it('should render todos from todoService.todos$', () => {
        fixture.detectChanges();

        expect(todoItemMocks.length).toBe(2);
        expect(todoItemMocks[0].todo).toEqual(todoMocks[0]);
        expect(todoItemMocks[1].todo).toEqual(todoMocks[1]);
    });

    it('should toggle a todo via the service when a todo item emits toggle', () => {
        fixture.detectChanges();

        todoItemMocks[0].toggle.emit(todoMocks[0]);

        expect(todoMocks[0].toggleDone).toHaveBeenCalled();
        expect(todoServiceMock.sendToggleDone).toHaveBeenCalledWith(todoMocks[0].id, false);
    });

});

class TodoMock implements Partial<Todo>{
    constructor(public id: string){
    }
    public done = false;
    public toggleDone = jasmine.createSpy('toggleDone');
}

class TodoServiceMock implements Partial<TodoService> {
    public todos$ = new BehaviorSubject<Array<Todo>>([]);
    public sendToggleDone = jasmine.createSpy('sendToggleDone');
}

@Component({
    selector: 'app-todo-item',
    standalone: true,
    template: '',
})
class TodoItemComponentStub implements Partial<TodoItemComponent> {
    @Input() public todo?: Todo;
    @Output() public toggle = new EventEmitter<Todo>();
    @Output() public remove = new EventEmitter<string>();
}
