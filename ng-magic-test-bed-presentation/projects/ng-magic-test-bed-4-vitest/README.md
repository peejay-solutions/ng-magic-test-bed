# ng-magic-test-bed

A streamlined unit test setup for Angular. It replaces verbose `TestBed.configureTestingModule` boilerplate with a small, type-safe API, and it creates spies for you: every mock is automatically extended with spies for all methods of the class being mocked.

## Pick your flavor

ng-magic-test-bed exists for two test runners. Install **one** of them, never both.

| | Jasmine | Vitest |
|---|---|---|
| Package | `@peejay-solutions/ng-magic-test-bed` | `@ng-magic-test-bed/vitest` |
| Install | `npm install @peejay-solutions/ng-magic-test-bed --save-dev` | `npm install @ng-magic-test-bed/vitest --save-dev` |
| API docs | [Jasmine API docs](https://peejay-solutions.github.io/ng-magic-test-bed/jasmine/) | [Vitest API docs](https://peejay-solutions.github.io/ng-magic-test-bed/vitest/) |

Both packages have the same API. They are built from the same implementation and the same regression tests: the Jasmine package is the source, and the Vitest package is kept in sync with it. The only difference is how spies look, because each package uses the spy primitives of its own test runner:

| Jasmine | Vitest |
|---|---|
| `spy.and.returnValue(x)` | `spy.mockReturnValue(x)` |
| `spy.and.callFake(fn)` | `spy.mockImplementation(fn)` |
| `spy.calls.mostRecent().args` | `spy.mock.lastCall` |

Both packages use `NgMagicTestBed` as the entry point. The Jasmine package additionally exports `NgMagicSetupTestBed`, an empty subclass of it with identical behavior; the Vitest package does not have it.

## Quick start

```typescript
import { NgMagicTestBed } from '@ng-magic-test-bed/vitest';

describe('MyService', () => {
  function setup() {
    const magic = new NgMagicTestBed();
    const dependencyMock = magic.serviceMock(DependencyService);
    const service = magic.injection(MyService); // triggers the TestBed configuration, call it after all mocks are set up
    return { service, dependencyMock };
  }

  it('should do X when Y', () => {
    const { service, dependencyMock } = setup();
    dependencyMock.someMethod.mockReturnValue('value');
    expect(service.doSomething()).toBe('expected');
  });
});
```

## What you get

- `serviceMock`, `objectMock`, `interfaceMock`, `factoryMock` and `providerMock` for mocking dependencies, with automatic spies.
- `componentMocks` and `directiveMocks` for replacing child components and directives in a fixture.
- `fixture` for creating a component fixture with initial inputs.
- `observer` for asserting observable emissions.
- Standalone functions `mock`, `mockInterface`, `mockComponent`, `observe` and `spyOnFunctionsOf` for use without a test bed instance.

See the API docs linked above for the full reference.

## Requirements

- Angular 21 or newer
- RxJS 6 or newer
- Vitest 3 or newer (Vitest package only)

## AI agents and LLM tools

The package ships a concise API reference as `llms.txt` (see the `llms` field in its `package.json`).

## License

MIT
