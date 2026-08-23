import { TestBed } from '@angular/core/testing';
import { IdGeneratorService } from '../id-generator-service/id-generator.service';
import { Todo, TodoFactory } from './todo.factory';

describe('TodoFactory(standard)', () => {
    let todoFactory: TodoFactory;
    let idGeneratorServiceMock: IdGeneratorServiceMock;

    beforeEach(() => {
        idGeneratorServiceMock = new IdGeneratorServiceMock();
        TestBed.configureTestingModule({
            providers: [
                { provide: IdGeneratorService, useValue: idGeneratorServiceMock },
            ],
        });
        todoFactory = TestBed.inject(TodoFactory);
    });


    it('create() should build a todo using the generated id and the given title', () => {
        idGeneratorServiceMock.generate.and.returnValue('generated-id');

        const todo = todoFactory.create({title: 'Buy milk', dueDate: null});

        expect(todo).toBeInstanceOf(Todo);
        expect(todo).toEqual(jasmine.objectContaining({
            id: 'generated-id',
            title: 'Buy milk',
            done: false,
            dueDate: null,
        }));
    });

    it('create() should use the given due date when one is provided', () => {
        idGeneratorServiceMock.generate.and.returnValue('generated-id');
        const dueDate = new Date('2026-08-10');

        const todo = todoFactory.create({title: 'Buy milk', dueDate});

        expect(todo.dueDate).toBe(dueDate);
    });

    it('todo.serialize should return ISerializedTodo with matching properties', ()=>{
        idGeneratorServiceMock.generate.and.returnValue('generated-id');
        const dueDate = new Date('2026-08-10');
        const todo = todoFactory.create({title: 'Buy milk', dueDate});

        const serialized = todo.serialize();
        
        expect(serialized).toEqual({id: 'generated-id', done: false, title: 'Buy milk', dueDate});
    });

    it('create() should deserialize if called with fully serialized param', ()=>{
        const dueDate = new Date('2026-08-10');
        const serializedTodo = {id: 'generated-id', done: false, title: 'Buy milk', dueDate};
        const todo = todoFactory.create(serializedTodo);
        expect(idGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(todo.serialize()).toEqual(serializedTodo);
    });
});

class IdGeneratorServiceMock implements Partial<IdGeneratorService> {
    public generate = jasmine.createSpy('generate');
}
