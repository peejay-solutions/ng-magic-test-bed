import { NgMagicSetupTestBed } from '../../../public-api';
import { IdGeneratorService } from '../id-generator-service/id-generator.service';
import { Todo, TodoFactory } from './todo.factory';

// This spec tests TodoFactory itself (its own create() logic).
// See todo/todo.service(magic).spec.ts for the other side: mocking TodoFactory
// via magic.factoryMock() when it is used as a dependency of another class.
describe('TodoFactory(magic)', () => {

    function setup() {
        const magic = new NgMagicSetupTestBed();
        const idGeneratorServiceMock = magic.serviceMock(IdGeneratorService);
        const todoFactory = magic.injection(TodoFactory);
        return { todoFactory, idGeneratorServiceMock };
    }

    it('create() should build a todo using the generated id and the given title', () => {
        const { todoFactory, idGeneratorServiceMock } = setup();
        idGeneratorServiceMock.generate.and.returnValue('generated-id');

        const todo = todoFactory.create({title : 'Buy milk', dueDate: null});

        expect(todo).toBeInstanceOf(Todo);
        expect(todo).toEqual(jasmine.objectContaining({
            id: 'generated-id',
            title: 'Buy milk',
            done: false,
            dueDate: null,
        }));
    });

    it('create() should use the given due date when one is provided', () => {
        const { todoFactory, idGeneratorServiceMock } = setup();
        idGeneratorServiceMock.generate.and.returnValue('generated-id');
        const dueDate = new Date('2026-08-10');

        const todo = todoFactory.create({title: 'Buy milk', dueDate});

        expect(todo.dueDate).toBe(dueDate);
    });

    it('todo.serialize should return ISerializedTodo with matching properties', ()=>{
        const { todoFactory, idGeneratorServiceMock } = setup();
        idGeneratorServiceMock.generate.and.returnValue('generated-id');
        const dueDate = new Date('2026-08-10');
        const todo = todoFactory.create({title: 'Buy milk', dueDate});

        const serialized = todo.serialize();
        
        expect(serialized).toEqual({id: 'generated-id', done: false, title: 'Buy milk', dueDate});
    });

    it('create() should deserialize if called with fully serialized param', ()=>{
        const { todoFactory, idGeneratorServiceMock } = setup();
        const dueDate = new Date('2026-08-10');
        const serializedTodo = {id: 'generated-id', done: false, title: 'Buy milk', dueDate};
        const todo = todoFactory.create(serializedTodo);
        expect(idGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(todo.serialize()).toEqual(serializedTodo);
    });
});
