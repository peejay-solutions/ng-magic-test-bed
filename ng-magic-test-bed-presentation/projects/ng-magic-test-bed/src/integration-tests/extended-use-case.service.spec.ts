import { Injectable } from '@angular/core';
import { NgMagicTestBed } from './ng-magic-test-bed.class';


@Injectable({
    providedIn: 'root'
})
export class MyHelperService {
    constructor() {
    }

    public doSomething(param) {
    }
}

@Injectable({
    providedIn: 'root',
    deps: [],
    useFactory: function () {
        return {
            doSomething: function (param: any) {
            }
        };
    }
})
export abstract class MyAbstractHelperService {
    public abstract doSomething(param: any);
}

@Injectable({
    providedIn: 'root'
})
export class MyService {
    public counter = 0;
    constructor(private myHelper: MyHelperService) {
    }

    public doSomething(param) {
        this.myHelper.doSomething(param);
        this.counter++;
    }
}

@Injectable({
    providedIn: 'root',
    deps: [MyHelperService],
    useFactory: function (myHelperService: MyAbstractHelperService) {
        const instance = {
            counter: 1,
            doSomething: function (value: any) {
                myHelperService.doSomething(value);
                instance.counter++;
            }
        };
        return instance;
    }
})
export abstract class MyAbstractService {
    public abstract counter: number;
    public abstract doSomething(value: any);
}

@Injectable({
    providedIn: 'root'
})
export class MyTestHelperService {
    constructor() {
    }

    public getValue(value: any) {
        return value;
    }
}

describe('TestBed for standard use case', () => {
    const magic = new NgMagicTestBed();
    const myHelperServiceMock = magic.mock(MyHelperService, () => MyHelperServiceMock);
    const myAbstractHelperServiceMock = magic.mock(MyAbstractHelperService, () => MyAbstractHelperServiceMock);
    const service = magic.injection(MyService);
    const abstractService = magic.injection(MyAbstractService);
    const myTestHelperService = magic.injection(MyTestHelperService);
    const myUnregisteredMock = magic.mock(() => new MyHelperServiceMock());
    const myNonTestBededService = new MyService(myUnregisteredMock);

    beforeEach(magic.happen);

    it('should work', () => {
        service.doSomething('hello');
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(service.counter).toEqual(1);
    });

    it('should work even for a second time', () => {
        service.doSomething('hello');
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(service.counter).toEqual(1);
    });

    it('should work for abstract', () => {
        abstractService.doSomething('hello');
        expect(myAbstractHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(abstractService.counter).toEqual(1);
    });

    it('should work for abstract even for a second time', () => {
        abstractService.doSomething('hello');
        expect(myAbstractHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(abstractService.counter).toEqual(1);
    });

    it('should work for simply unregistered', () => {
        myNonTestBededService.doSomething('hello');
        expect(myUnregisteredMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(abstractService.counter).toEqual(1);
    });

    it('should work for simply unregistered even for a second time', () => {
        myNonTestBededService.doSomething('hello');
        expect(myUnregisteredMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(abstractService.counter).toEqual(1);
    });
});


class MyHelperServiceMock {
    constructor() {
    }
    public doSomething() {
    }
}

class MyAbstractHelperServiceMock {
    constructor() {
    }
    public doSomething() {
    }
}
