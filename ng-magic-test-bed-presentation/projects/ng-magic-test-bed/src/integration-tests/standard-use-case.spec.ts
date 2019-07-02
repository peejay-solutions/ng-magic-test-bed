import { Injectable } from '@angular/core';
import { NgMagicTestBed } from '../test-bed/ng-magic-test-bed.class';
import { TestBed } from '@angular/core/testing';

//################# Predefintions ##############################

@Injectable({
    providedIn: 'root'
})
export class MyHelperService {
    private counter = 0;
    constructor() {
    }

    public doSomething(param: number) {
        this.counter = this.counter + param;
    }

    public getData(param: number) {
        return {
            value: param / 2
        };
    }
}

@Injectable({
    providedIn: 'root'
})
export class MyService {
    constructor(private myHelper: MyHelperService) {
    }

    public doSomething(param: number) {
        const data = this.myHelper.getData(param);
        this.myHelper.doSomething(data.value);
    }
}

//################# Real Spec File###############################

describe('Simple integration test for magic TestBed', () => {
    const magic = new NgMagicTestBed();
    const myHelperServiceMock = magic.serviceMock(MyHelperService, () => new MyHelperServiceMock());
    const service = magic.injection(MyService);
    magic.happens();

    it('should work', () => {
        const param = 4;
        service.doSomething(param);
        expect(myHelperServiceMock.getData).toHaveBeenCalledWith(4);
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith(myHelperServiceMock.data.value);
    });
});

class MyHelperServiceMock {
    public data = { value: 100 };
    public getData = () => this.data;
}


describe('Simple integration test for no magic but standard TestBed', () => {
    let myHelperServiceMock;
    let service: MyService;

    beforeEach(() => {
        const data = { value: 100 };
        myHelperServiceMock = new MyHelperServiceMock2();
        TestBed.configureTestingModule({
            providers: [
                { provide: MyHelperService, useValue: myHelperServiceMock },
            ]
        });
        service = TestBed.get(MyService);
    });

    it('should work', () => {
        const param = 4;
        service.doSomething(param);
        expect(myHelperServiceMock.getData).toHaveBeenCalledWith(4);
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith(myHelperServiceMock.data.value);
    });
});

class MyHelperServiceMock2 {
    public data = { value: 100 };
    public doSomething = jasmine.createSpy('doSomething');
    public getData = jasmine.createSpy('getData').and.returnValue(this.data);
}

