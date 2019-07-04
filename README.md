# ng-magic-test-bed

A magic test bed for angular. This Wrapper for the well known angular test bed (@angular/core/testing) allows you to remove a lot of bloat code form your spec files.

# Benefits
- Better readability

- Less code

- All local variables referencing mocks, helper-services, observers, objects, arrays, maps and the testee itself can be defined as constants

- Configuration of the test bed is done implicitly while assigning your local variables

- Reconfiguration of the entire test bed including fresh mocks and services before each test/it is done in background

- Creation of jest or jasmine (karma) spies for all your mocks' functions is done implicitly. No more spy manual spy creation with magic strings to overwrite strongly typed methods of TypeScript objects.

- A simple mock with spies for all methods of a service is generated. You can extend these auto generated mocks with custom behavior.

- Write tests without beforeEach.


# Installation 

npm install @peejay-solutions/ng-magic-test-bed --save

https://www.npmjs.com/package/@peejay-solutions/ng-magic-test-bed

# Sample
Here a short example where we test the implementation of the following: We have MyServer that does something using MyHelperService to get data and do another thing. 
## MyHelperService

```typescript 

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

```

## MyService

```typescript 
@Injectable({
    providedIn: 'root'
})
export class MyService {
    constructor(private myHelper: MyHelperService) {
    }

    public doSomething(param) {
        const data = this.myHelper.getData(param);
        this.myHelper.doSomething(data.value);
    }
}
```

## MyService spec with magic test bed
```typescript 
describe('Simple integration test for magic TestBed', () => {
    const magic = new NgMagicTestBed();
    const myHelperServiceMock = magic.serviceMock(MyHelperService, () => new MyHelperServiceMock());
    const service = magic.injection(MyService);

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

```
## MyService spec with no magic but standard test bed

```typescript 
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
```
#

The running code can be found <a href="https://github.com/peejay-solutions/ng-magic-test-bed/blob/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/integration-tests/standard-use-case.spec.ts">here</a>

# Concept

Working with Reflection and pointers should not be considered as bad style to create a freshly initialized sterile test environment with mocks and spies for each test case. With this mindset and some static methods that can be found on <a href="https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object">Object</a> I was able to create this library. 


# Documentation

... Work in progress.






