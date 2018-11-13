import { Injectable } from '@angular/core';
import { NgMagicTestBed } from '../test-bed/ng-magic-test-bed.class';


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
    deps: [MyAbstractHelperService],
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

describe('Extended integration test for TestBed', () => {
    const magic = new NgMagicTestBed();
    const myHelperServiceMock = magic.mock(MyHelperService, () => MyHelperServiceMock);
    const myAbstractHelperServiceMock = magic.mock(MyAbstractHelperService, () => MyAbstractHelperServiceMock);
    const service = magic.injection(MyService);
    const myAbstractService = magic.injection(MyAbstractService);
    const myTestHelperService = magic.injection(MyTestHelperService);
    const myUnregisteredMock = magic.mock(() => new MyUnregisteredHelperServiceMock());
    const myNonTestBededService = magic.object(() => new MyService(myUnregisteredMock));

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
        myAbstractService.doSomething('hello');
        expect(myAbstractHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(myAbstractService.counter).toEqual(1);
    });

    it('should work for abstract even for a second time', () => {
        myAbstractService.doSomething('hello');
        expect(myAbstractHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(myAbstractService.counter).toEqual(1);
    });

    it('should work for simply unregistered', () => {
        myNonTestBededService.doSomething('hello');
        expect(myUnregisteredMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(myNonTestBededService.counter).toEqual(1);
    });

    it('should work for simply unregistered even for a second time', () => {
        myNonTestBededService.doSomething('hello');
        expect(myUnregisteredMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(myNonTestBededService.counter).toEqual(1);
    });
});


class MyUnregisteredHelperServiceMock {
    public doSomething() {
    }
}

class MyHelperServiceMock {
    public doSomething() {
    }
}

class MyAbstractHelperServiceMock {
    public doSomething() {
    }
}
