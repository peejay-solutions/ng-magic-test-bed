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

describe('Simple integration test for TestBed', () => {
    const magic = new NgMagicTestBed();
    const myHelperServiceMock = magic.mock(MyHelperService, () => MyHelperServiceMock);
    const service = magic.injection(MyService);

    beforeEach(magic.happen);

    it('should work', () => {
        service.doSomething('hello');
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(service.counter).toEqual(1);
    });

    it('should work even for a second time', () => {
        service.doSomething('hello');
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(service.counter).toEqual(1);
    });
});


class MyHelperServiceMock {
    constructor() {
    }
    public doSomething() {
    }
}
