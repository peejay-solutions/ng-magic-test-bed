import { Injectable } from '@angular/core';
import { NgMagicSetupTestBed } from '../test-bed/ng-magic-setup-test-bed.class';
import { spyOnFunctionsOf } from '../spy-on-functions/spy-on-functions-of.function';

export class InstantiableHelper {
    public helping = false;
    public help() {
        this.helping = true;
    }
}

@Injectable({
    providedIn: 'root'
})
export class MyHelperFactory {
    create() {
        return new InstantiableHelper();
    }
}

@Injectable({
    providedIn: 'root'
})
export class MySimpleHelperService {
    constructor() {
    }
    public doSomething(param) {
    }
}

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
    public myHelperInstance: InstantiableHelper;
    constructor(private myHelper: MyHelperService,
         private mySimpleHelper: MySimpleHelperService,
         private myHelperFactory: MyHelperFactory) {
             this.myHelperInstance = this.myHelperFactory.create();
    }

    public doSomething(param) {
        this.myHelper.doSomething(param);
        this.mySimpleHelper.doSomething(param);
        this.counter++;
        this.myHelperInstance.help();
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
    function setup() {
        const magic = new NgMagicSetupTestBed();
        const myHelperServiceMock = magic.serviceMock(MyHelperService, new MyHelperServiceMock());
        const myAbstractHelperServiceMock = magic.serviceMock(MyAbstractHelperService, new MyAbstractHelperServiceMock());
        const mySimpleHelperMock = magic.serviceMock(MySimpleHelperService);
        const helperMock = magic.objectMock(InstantiableHelper, {helping: true});
        const myHelperFactoryMock = magic.factoryMock(MyHelperFactory, [helperMock]);
        const service = magic.injection(MyService);
        const myAbstractService = magic.injection(MyAbstractService);
        const myTestHelperService = magic.injection(MyTestHelperService);
        const myUnregisteredMock = spyOnFunctionsOf(new MyUnregisteredHelperServiceMock());
        const myUnregisteredSimpleHelperMock = spyOnFunctionsOf(new MySimpleHelperService());
        const myUnregisteredFactoryMock = spyOnFunctionsOf(new MyHelperFactory());
        const myNonTestBededService = new MyService(myUnregisteredMock, myUnregisteredSimpleHelperMock, myUnregisteredFactoryMock);
        return {
            myHelperServiceMock, myNonTestBededService, mySimpleHelperMock, myAbstractHelperServiceMock, service,
            myUnregisteredSimpleHelperMock, myUnregisteredMock, myAbstractService, myTestHelperService, myHelperFactoryMock,
            helperMock
        };
    }

    it('should work', () => {
        const { myHelperServiceMock, service, myTestHelperService , myHelperFactoryMock} = setup();
        service.doSomething('hello');
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(service.counter).toEqual(1);
        expect(myHelperFactoryMock.create).toHaveBeenCalled();
    });

    it('should work even for a second time', () => {
        const { myHelperServiceMock, service, myTestHelperService , myHelperFactoryMock} = setup();
        service.doSomething('hello');
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(service.counter).toEqual(1);
        expect(myHelperFactoryMock.create).toHaveBeenCalled();
    });

    it('should work for abstract', () => {
        const { myAbstractService, myAbstractHelperServiceMock, myTestHelperService } = setup();
        myAbstractService.doSomething('hello');
        expect(myAbstractHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(myAbstractService.counter).toEqual(2);
    });

    it('should work for abstract even for a second time', () => {
        const { myAbstractService, myAbstractHelperServiceMock, myTestHelperService } = setup();
        myAbstractService.doSomething('hello');
        expect(myAbstractHelperServiceMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(myAbstractService.counter).toEqual(2);
    });

    it('should work for simply unregistered', () => {
        const { myNonTestBededService, myUnregisteredMock, myTestHelperService } = setup();
        myNonTestBededService.doSomething('hello');
        expect(myUnregisteredMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(myNonTestBededService.counter).toEqual(1);
    });

    it('should work for simply unregistered even for a second time', () => {
        const { myNonTestBededService, myUnregisteredMock, myTestHelperService } = setup();
        myNonTestBededService.doSomething('hello');
        expect(myUnregisteredMock.doSomething).toHaveBeenCalledWith('hello');
        expect(myTestHelperService.getValue('x')).toEqual('x');
        expect(myNonTestBededService.counter).toEqual(1);
    });

    it('should work with simple generated mock', () => {
        const { service, mySimpleHelperMock } = setup();
        service.doSomething('hello');
        expect(mySimpleHelperMock.doSomething).toHaveBeenCalledWith('hello');
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
