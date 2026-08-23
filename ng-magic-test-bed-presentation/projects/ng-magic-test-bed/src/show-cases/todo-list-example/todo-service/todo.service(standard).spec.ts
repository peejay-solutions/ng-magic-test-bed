import { HttpClient } from '@angular/common/http';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Todo } from '../todo-factory/todo.factory';
import { TodoFactory } from '../todo-factory/todo.factory';
import { TodoService } from './todo.service';
import { Spy } from '../../../spy-framework/spy-framework';
import { ISerializedTodo } from './i-serialized-todo';

describe('TodoService(standard)', () => {
    let todoService: TodoService;
    let httpClientMock: HttpClientMock;
    let todoFactoryMock: TodoFactoryMock;
    let todoMocks: Array<any>; // Weak type
    let nextSpy: Spy;


    beforeEach(fakeAsync(()=>{
        todoMocks = [
            new TodoMock({id : '1', title: 'todo 1', done: false, dueDate: null}),
            new TodoMock({id : '2', title: 'todo 2', done: false, dueDate: null}),
            new TodoMock({id : '3', title: 'todo 3', done: false, dueDate: null}),
            new TodoMock({id : '4', title: 'todo 4', done: false, dueDate: null}),
        ]
        todoFactoryMock = new TodoFactoryMock();
        todoFactoryMock.create.and.returnValues(...todoMocks);
        httpClientMock = new HttpClientMock();
        const serializedTodos: Array<ISerializedTodo> = [
            {id : '1', title: 'todo 1', done: false, dueDate: null},
            {id : '2', title: 'todo 2', done: false, dueDate: null}
        ]
        httpClientMock.get.and.returnValue(of(serializedTodos));
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HttpClient,
                    useValue: httpClientMock //Weak type
                },
                {
                    provide: TodoFactory,
                    useValue: todoFactoryMock //Weak type
                }
            ]

        });

        todoService = TestBed.inject(TodoService);
        flush(); // let the constructor-triggered reload() (await firstValueFrom(...)) resolve

        nextSpy = jasmine.createSpy('next');
        todoService.todos$.subscribe(newTodos => nextSpy(newTodos));
    }));

     it('should GET all todos', () => {
    
        expect(todoFactoryMock.create).toHaveBeenCalledTimes(2);
        expect(httpClientMock.get).toHaveBeenCalledWith('/api/todos');
        expect(nextSpy).toHaveBeenCalledWith(todoMocks.slice(0, 2));
    });

    it('add() should create a todo via the factory and POST its serialization', fakeAsync(() => {
        httpClientMock.post.and.returnValue(of(null));
        const serializedTodo: any = { serialized:true};
        todoMocks[2].serialize.and.returnValue(serializedTodo);
        flush();

        todoService.add('Buy milk');

        expect(todoFactoryMock.create).toHaveBeenCalledWith({title: 'Buy milk', dueDate: null});
        expect(httpClientMock.post).toHaveBeenCalledWith('/api/todos', serializedTodo);
    }));

    it('toggleDone() should call toggleDone() on the todo and PUT it', () => {
        httpClientMock.put.and.returnValue(of(null));

        todoService.sendToggleDone('id', true);

        expect(httpClientMock.put).toHaveBeenCalledWith('/api/todos/id', true);
    });
});

class HttpClientMock implements Partial<HttpClient> {
    public get = jasmine.createSpy('get');
    public post = jasmine.createSpy('post');
    public put = jasmine.createSpy('put');
}

class TodoFactoryMock implements Partial<TodoFactory> {
    public create = jasmine.createSpy('create');
}

// Everything objectMock() gave us for free in the magic spec has to be
// written by hand here: a class implementing Partial<Todo> with a manual
// spy for every method a test might call.
class TodoMock implements Partial<Todo> {
    public id: string;
    public title: string;
    public done: boolean;
    public dueDate: Date | null;
    public toggleDone = jasmine.createSpy('toggleDone');
    public isOverdue = jasmine.createSpy('isOverdue');
    public serialize = jasmine.createSpy('serialize');

    constructor(data: { id: string; title: string; done: boolean; dueDate: Date | null }) {
        this.id = data.id;
        this.title = data.title;
        this.done = data.done;
        this.dueDate = data.dueDate;
    }
}
