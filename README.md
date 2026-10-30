# ng-magic-test-bed

A magic test bed for Angular. It wraps the well-known Angular TestBed (`@angular/core/testing`) and removes a lot of boilerplate from your spec files.

## Benefits

- **Better readability.** Specs state what is tested, not how the testing module is wired.
- **Less code.** Mocks, spies and the test module configuration are created for you.
- **Spies for free.** Spies for all functions of your mocks are created implicitly. No more manual spy creation with magic strings to overwrite strongly typed methods of TypeScript objects.
- **Generated mocks you can extend.** A mock with spies for all methods of a service is generated automatically. You can extend it with custom behavior.

![](https://github.com/peejay-solutions/ng-magic-test-bed/blob/master/github-readme-assets/trailer.gif)

## Two flavors, pick one

ng-magic-test-bed exists for two test runners. Both have the same API and are kept in sync, so you install **one** of them, never both.

| | Jasmine | Vitest |
|---|---|---|
| Package | [`@peejay-solutions/ng-magic-test-bed`](https://www.npmjs.com/package/@peejay-solutions/ng-magic-test-bed) | [`@ng-magic-test-bed/vitest`](https://www.npmjs.com/package/@ng-magic-test-bed/vitest) |
| Test runner | Jasmine (Karma) | Vitest 3 or newer |
| Angular | 21 or newer | 21 or newer |
| Entry point | `NgMagicSetupTestBed` | `NgMagicTestBed` |
| API docs | [Jasmine API docs](https://peejay-solutions.github.io/ng-magic-test-bed/jasmine/) | [Vitest API docs](https://peejay-solutions.github.io/ng-magic-test-bed/vitest/) |
| Jump to | [Jasmine](#jasmine) | [Vitest](#vitest) |

The Angular versions are enforced by the `peerDependencies` of both packages (`@angular/core >=21`) and are tested with Angular 21.2.

Both packages share the same implementation and the same regression tests: the Jasmine package is the source, the Vitest package is synced from it. The differences are the spies (each package uses the spy primitives of its own test runner) and the entry point class. `NgMagicSetupTestBed` is an empty subclass of `NgMagicTestBed` that only the Jasmine package exports.

| Jasmine | Vitest |
|---|---|
| `spy.and.returnValue(x)` | `spy.mockReturnValue(x)` |
| `spy.and.callFake(fn)` | `spy.mockImplementation(fn)` |
| `spy.calls.mostRecent().args` | `spy.mock.lastCall` |
| `jasmine.createSpy('name')` | `vi.fn()` |

## The sample

Here is a short example. We test `MyService`, which uses `MyHelperService` to get data and do something with it. This code under test is the same for both flavors.

### MyHelperService

```typescript
@Injectable({
    providedIn: 'root'
})
export class MyHelperService {
    private counter = 0;

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

### MyService

```typescript
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
```

## Jasmine

```bash
npm install @peejay-solutions/ng-magic-test-bed --save-dev
```

### MyService spec with the magic test bed

```typescript
import { NgMagicSetupTestBed } from '@peejay-solutions/ng-magic-test-bed';

describe('MyService', () => {
    function setup() {
        const magic = new NgMagicSetupTestBed();
        const myHelperServiceMock = magic.serviceMock(MyHelperService, new MyHelperServiceMock());
        const service = magic.injection(MyService);
        return { myHelperServiceMock, service };
    }

    it('should work', () => {
        const { service, myHelperServiceMock } = setup();
        service.doSomething(4);
        expect(myHelperServiceMock.getData).toHaveBeenCalledWith(4);
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith(myHelperServiceMock.data.value);
    });
});

class MyHelperServiceMock {
    public data = { value: 100 };
    public getData = () => this.data;
}
```

### The same spec with the standard TestBed

```typescript
describe('MyService', () => {
    let myHelperServiceMock: MyHelperServiceMock;
    let service: MyService;

    beforeEach(() => {
        myHelperServiceMock = new MyHelperServiceMock();
        TestBed.configureTestingModule({
            providers: [
                { provide: MyHelperService, useValue: myHelperServiceMock },
            ]
        });
        service = TestBed.inject(MyService);
    });

    it('should work', () => {
        service.doSomething(4);
        expect(myHelperServiceMock.getData).toHaveBeenCalledWith(4);
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith(myHelperServiceMock.data.value);
    });
});

class MyHelperServiceMock {
    public data = { value: 100 };
    public doSomething = jasmine.createSpy('doSomething');
    public getData = jasmine.createSpy('getData').and.returnValue(this.data);
}
```

### Jasmine: learn from the code

- [Todo list example](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/show-cases/todo-list-example): a realistic example, see the table below.
- [Service example](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/show-cases/service-test): the sample above as a running spec.
- [Integration tests](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/tests): one spec file per method of the library. They double as executable documentation.
- [Documentation](https://peejay-solutions.github.io/ng-magic-test-bed/jasmine/classes/NgMagicSetupTestBed.html) of `NgMagicSetupTestBed`.

## Vitest

```bash
npm install @ng-magic-test-bed/vitest --save-dev
```

`describe`, `it`, `expect` and `vi` are used as globals here, as configured by Angular's Vitest-based `@angular/build:unit-test` builder. Import them from `vitest` if your setup does not provide them as globals.

### MyService spec with the magic test bed

```typescript
import { NgMagicTestBed } from '@ng-magic-test-bed/vitest';

describe('MyService', () => {
    function setup() {
        const magic = new NgMagicTestBed();
        const myHelperServiceMock = magic.serviceMock(MyHelperService, new MyHelperServiceMock());
        const service = magic.injection(MyService);
        return { myHelperServiceMock, service };
    }

    it('should work', () => {
        const { service, myHelperServiceMock } = setup();
        service.doSomething(4);
        expect(myHelperServiceMock.getData).toHaveBeenCalledWith(4);
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith(myHelperServiceMock.data.value);
    });
});

class MyHelperServiceMock {
    public data = { value: 100 };
    public getData = () => this.data;
}
```

### The same spec with the standard TestBed

```typescript
describe('MyService', () => {
    let myHelperServiceMock: MyHelperServiceMock;
    let service: MyService;

    beforeEach(() => {
        myHelperServiceMock = new MyHelperServiceMock();
        TestBed.configureTestingModule({
            providers: [
                { provide: MyHelperService, useValue: myHelperServiceMock },
            ]
        });
        service = TestBed.inject(MyService);
    });

    it('should work', () => {
        service.doSomething(4);
        expect(myHelperServiceMock.getData).toHaveBeenCalledWith(4);
        expect(myHelperServiceMock.doSomething).toHaveBeenCalledWith(myHelperServiceMock.data.value);
    });
});

class MyHelperServiceMock {
    public data = { value: 100 };
    public doSomething = vi.fn();
    public getData = vi.fn().mockReturnValue(this.data);
}
```

### Vitest: learn from the code

- [Todo list example](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/src/show-cases/todo-list-example): the same realistic example as in the Jasmine package, written as best-practice Vitest. See the table below.
- [Integration tests](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/src/tests): identical to the Jasmine ones, because they only use the library's spy abstraction.
- [Documentation](https://peejay-solutions.github.io/ng-magic-test-bed/vitest/classes/NgMagicTestBed.html) of `NgMagicTestBed`.

## The todo list example, side by side

The todo list example tests seven kinds of Angular building blocks. Every folder contains a `(magic)` spec written with ng-magic-test-bed and a `(standard)` spec written with plain Angular TestBed, so you can compare them directly.

| What is tested | Jasmine | Vitest |
|---|---|---|
| Pipe | [due-in-pipe](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/show-cases/todo-list-example/due-in-pipe) | [due-in-pipe](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/src/show-cases/todo-list-example/due-in-pipe) |
| Service without dependencies | [id-generator-service](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/show-cases/todo-list-example/id-generator-service) | [id-generator-service](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/src/show-cases/todo-list-example/id-generator-service) |
| Directive | [overdue-highlight-directive](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/show-cases/todo-list-example/overdue-highlight-directive) | [overdue-highlight-directive](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/src/show-cases/todo-list-example/overdue-highlight-directive) |
| Factory | [todo-factory](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/show-cases/todo-list-example/todo-factory) | [todo-factory](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/src/show-cases/todo-list-example/todo-factory) |
| Child component (needs mocking) | [todo-item-component](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/show-cases/todo-list-example/todo-item-component) | [todo-item-component](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/src/show-cases/todo-list-example/todo-item-component) |
| Parent component | [todo-list](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/show-cases/todo-list-example/todo-list) | [todo-list](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/src/show-cases/todo-list-example/todo-list) |
| Service with dependencies | [todo-service](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/show-cases/todo-list-example/todo-service) | [todo-service](https://github.com/peejay-solutions/ng-magic-test-bed/tree/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/src/show-cases/todo-list-example/todo-service) |

## AI agents and LLM tools

Both packages ship a concise API reference as `llms.txt`:
[Jasmine](https://github.com/peejay-solutions/ng-magic-test-bed/blob/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/llms.txt) and
[Vitest](https://github.com/peejay-solutions/ng-magic-test-bed/blob/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed-4-vitest/llms.txt).

## Documentation

The API documentation has one site per flavor, see the [landing page](https://peejay-solutions.github.io/ng-magic-test-bed/).
