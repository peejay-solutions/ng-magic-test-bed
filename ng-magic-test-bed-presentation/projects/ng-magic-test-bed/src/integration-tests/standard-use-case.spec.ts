import { Injectable, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgMagicSetupTestBed } from '../test-bed/ng-magic-setup-test-bed.class';

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


//################## Standard Test Bed 

describe('Simple integration test for no magic but standard TestBed', () => {
    let myHelperServiceMock;
    let service: MyService;

    beforeEach(() => {
        myHelperServiceMock = new MyHelperServiceMock2();
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: MyHelperService,
                    useValue: myHelperServiceMock
                },
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

//################## Magic Test Bed 

describe('Simple integration test for ng magic setup test bed', () => {
    function setup() {
        const magic = new NgMagicSetupTestBed();
        return {
            myHelperServiceMock: magic.serviceMock(MyHelperService, new MyHelperServiceMock()),
            service: magic.injection(MyService),
        };
    }

    it('should work', () => {
        const { service, myHelperServiceMock } = setup();
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
