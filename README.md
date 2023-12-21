# ng-magic-test-bed

A magic test bed for angular. This Wrapper for the well known angular test bed (@angular/core/testing) allows you to remove a lot of bloat code form your spec files.

# Benefits
- Better readability

- Less code

- Creation of jasmine (karma) spies for all your mocks' functions is done implicitly. No more manual spy creation with magic strings to overwrite strongly typed methods of TypeScript objects.

- A simple mock with spies for all methods of a service is generated. You can extend these auto generated mocks with custom behavior.

# Trailer

![](https://github.com/peejay-solutions/ng-magic-test-bed/blob/master/github-readme-assets/trailer.gif)

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
describe('Simple integration test for ng magic setup test bed', () => {
    function setup() {
        const magic = new NgMagicSetupTestBed();
        const myHelperServiceMock = magic.serviceMock(MyHelperService, new MyHelperServiceMock());
        const service = magic.injection(MyService);
        return { myHelperServiceMock, service };
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


# Documentation


https://peejay-solutions.github.io/ng-magic-test-bed/classes/NgMagicSetupTestBed.html




