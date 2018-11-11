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
    providedIn: 'root'
})
export class MyTestHelperService {
    constructor() {
    }

    public getValue(value: any) {
        return value;
    }
}


export class MyHelperServiceMock {
    constructor() {

    }
    public doSomething = (param) => {
    }
}

describe('TestBed', () => {
    const magic = new NgMagicTestBed();
    const myHelperServiceMock = magic.mock(MyHelperService, MyHelperServiceMock);
    const service = magic.injection(MyService);
    const myTestHelperService = magic.injection(MyTestHelperService);

    beforeEach(magic.happen);

    it('should work', () => {
        service.doSomething('hello');
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(service.counter).toEqual(1);
    });

    it('should work even for second time', () => {
        service.doSomething('hello');
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(service.counter).toEqual(1);
    });
});
