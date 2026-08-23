import { Injectable } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';

// Covers serviceMock() for an abstract class, as opposed to a plain concrete
// @Injectable service. An abstract method has no implementation on the
// prototype at runtime (TypeScript compiles it away entirely), so
// spyOnFunctionsOf() has nothing to find/spy there. serviceMock() therefore
// needs a concrete mock object/class passed in for abstract classes - it
// can't auto-spy from the prototype alone the way it does for a concrete
// class. Migrated from the former extended-use-case.service.spec.ts.

@Injectable({
    providedIn: 'root',
    deps: [],
    useFactory: () => ({
        doSomething: (param: any) => { },
    }),
})
abstract class MyAbstractHelperService {
    public abstract doSomething(param: any): void;
}

class MyAbstractHelperServiceMock {
    public doSomething(param: any) { }
}

@Injectable({
    providedIn: 'root',
    deps: [MyAbstractHelperService],
    useFactory: (myHelperService: MyAbstractHelperService) => {
        const instance = {
            counter: 1,
            doSomething: (value: any) => {
                myHelperService.doSomething(value);
                instance.counter++;
            },
        };
        return instance;
    },
})
abstract class MyAbstractService {
    public abstract counter: number;
    public abstract doSomething(value: any): void;
}

describe('serviceMock() for an abstract class', () => {

    it('should spy the abstract class (via a concrete mock class) and be usable as a dependency of a useFactory-provided service', () => {
        const magic = new NgMagicSetupTestBed();
        const myAbstractHelperServiceMock = magic.serviceMock(MyAbstractHelperService, new MyAbstractHelperServiceMock());
        const myAbstractService = magic.injection(MyAbstractService);

        myAbstractService.doSomething('hello');

        expect(myAbstractHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myAbstractService.counter).toEqual(2);
    });

});
