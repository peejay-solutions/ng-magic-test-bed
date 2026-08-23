import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgMagicSetupTestBed } from '../../../public-api';
import { Todo } from '../todo-factory/todo.factory';
import { TodoFactory } from '../todo-factory/todo.factory';
import { TodoService } from './todo.service';
import { fakeAsync, flush } from '@angular/core/testing';

describe('TodoService(magic)', () => {

    function setup() {
        const magic = new NgMagicSetupTestBed();
        // HttpClient has no @Injectable of our own to mock manually - serviceMock()
        // auto-spies every prototype method (get/post/put/...) in one line.
        const httpClientMock = magic.serviceMock(HttpClient);
        // objectMock() gives us a Todo-shaped object where every prototype
        // method (toggleDone, isOverdue, ...) is replaced by a spy. We don't
        // want to exercise Todo's real logic here - only check that
        // TodoService creates one via the factory and posts it.
        const todoMocks = [
            magic.objectMock(Todo, { id: '1' }),
            magic.objectMock(Todo, { id: '2' }),
            magic.objectMock(Todo, { id: '3' }),
            magic.objectMock(Todo, { id: '4' }),
        ];
        httpClientMock.get.and.returnValue(of([
            { id: '1' } as any,
            { id: '2' } as any
        ]));
        // factoryMock() makes TodoFactory.create() return exactly this
        // objectMock instance instead of building a real Todo.
        const todoFactoryMock = magic.factoryMock(TodoFactory, todoMocks)
        const todoService = magic.injection(TodoService);
        const todosObserver = magic.observer(todoService.todos$);
        return { todoService, httpClientMock, todoFactoryMock, todoMocks, todosObserver };
    }

    it('should GET all todos', fakeAsync(() => {
        const { httpClientMock, todoFactoryMock, todoMocks, todosObserver } = setup();
    
        flush();
        expect(todoFactoryMock.create).toHaveBeenCalledTimes(2);
        expect(httpClientMock.get).toHaveBeenCalledWith('/api/todos');
        expect(todosObserver.latest).toEqual(todoMocks.slice(0, 2));
    }));

    it('add() should create a todo via the factory and POST its serialization', fakeAsync(() => {
        const { todoService, httpClientMock, todoFactoryMock, todoMocks } = setup();
        httpClientMock.post.and.returnValue(of(null));
        const serializedTodo: any = { serialized:true};
        todoMocks[2].serialize.and.returnValue(serializedTodo);
        flush();

        todoService.add('Buy milk');

        expect(todoFactoryMock.create).toHaveBeenCalledWith({title: 'Buy milk', dueDate: null});
        expect(httpClientMock.post).toHaveBeenCalledWith('/api/todos', serializedTodo);
    }));

    it('toggleDone() should call toggleDone() on the todo and PUT it', () => {
        const { todoService, httpClientMock, todoMocks } = setup();
        httpClientMock.put.and.returnValue(of(null));

        todoService.sendToggleDone('id', true);

        expect(httpClientMock.put).toHaveBeenCalledWith('/api/todos/id', true);
    });

});
