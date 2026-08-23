# CLAUDE.md — ng-magic-test-bed

This file orients Claude inside this repo. For the public API reference (what
each method does, signatures, usage snippets), read **`llms.txt`** at the
project root first — it's the authoritative, up-to-date API doc and is kept
in sync with the published package. This file covers what `llms.txt`
doesn't: repo layout, internal architecture, testing conventions, and
gotchas discovered while working in this codebase.

## What this is

`@peejay-solutions/ng-magic-test-bed` is an Angular library (published to
npm) that wraps `TestBed` with a fluent, auto-spying API. It removes the
boilerplate of manually creating `jasmine.SpyObj`s and wiring up
`TestBed.configureTestingModule()` / `overrideComponent()` /
`overrideDirective()` by hand. Tests use Jasmine.

## Class hierarchy (a quirk worth knowing)

- `NgMagicTestBed` (`src/test-bed/ng-magic-test-bed.class.ts`) is the actual
  implementation — all public methods live here.
- `NgMagicSetupTestBed` (`src/test-bed/ng-magic-setup-test-bed.class.ts`) is
  an **empty subclass** of `NgMagicTestBed` — no added members. It's the
  name used throughout `llms.txt`, the showcases, and most tests. A handful
  of older specs still instantiate `NgMagicTestBed` directly; both work
  identically. Default to `NgMagicSetupTestBed` in new code, matching the
  public docs.
- `TestBedConfigurator` (`src/test-bed/test-bed-configurator.class.ts`) is
  the internal engine `NgMagicTestBed` delegates to — it accumulates
  `TestModuleMetadata` (providers, imports, declarations, schemas) and
  performs the actual `TestBed.configureTestingModule()` /
  `overrideComponent()` calls once `injection()` or `fixture()` locks the
  configuration.

## Directory layout

```
src/
  test-bed/          Library core: NgMagicTestBed, NgMagicSetupTestBed, TestBedConfigurator
  mock/              mock() and mockComponent() — standalone, TestBed-free mocking
  observe/           observe() / SpyObserver — spy-wraps an Observable's subscription
  spy-on-functions/  spyOnFunctionsOf() — the low-level auto-spy primitive everything else builds on
  spy-framework/     Thin Jasmine spy type helpers (Spy<F>, SpyObj<T>, createSpy)
  public-api.ts      The package's public export surface — check this before assuming something is exported

  tests/             Atomic integration tests, ONE method/feature per file, *.integration.spec.ts.
                     This is the regression suite for the library's own API surface.

  show-cases/        Comparison / teaching material — magic vs. standard TestBed, side by side.
                     Each pair should show state-of-the-art Angular (standalone: true).
                     Non-standalone (standalone: false / NgModule) cases belong in tests/, not here.
    component-test/    Small synthetic component+service+directive scenario
    service-test/      Small synthetic service+helper scenario
    todo-list-example/ A fuller, realistic feature (service, factory, pipe, directive, 2 components)
```

## Naming & pairing convention

- Files that compare the two approaches use a **`(magic)` / `(standard)`
  suffix** on the spec filename, sharing the same production `.ts`/`.html`:
  `todo.service(magic).spec.ts` vs. `todo.service(standard).spec.ts`, both
  testing `todo.service.ts`. Keep both halves of a pair testing the exact
  same behavior/assertions so the comparison is meaningful — a reader should
  be able to diff the two spec files and see only *setup* differences, not
  different test intent.
- Integration tests in `tests/` use `*.integration.spec.ts` and typically
  open with a `// Covers X()` comment explaining which API surface the file
  exercises and any non-obvious semantics (see existing files for the
  pattern).
- The common structure inside a spec is a local `setup()` function that
  returns everything the `it()` blocks need — avoids `beforeEach` +
  shared mutable state, keeps each test's dependencies explicit.

## Known gotchas (learned the hard way in this repo)

These aren't bugs in the library — they're sharp edges in how
`NgMagicTestBed`/Angular TestBed interact. Worth checking first when a test
fails in a confusing way.

1. **`overrideImportsIfStandalone` uses `set`, not `remove`/`add`.**
   `TestBedConfigurator` replaces a standalone fixture root's entire
   `imports` array with its accumulated `fixtureImports` list. If the
   component's template uses `*ngIf`/`*ngFor` (or any other structural
   directive/pipe from its original `imports`) and you call *any*
   `kept*`/`*Mocks` method, that structural directive silently disappears
   unless you also explicitly `keptDirectives(NgIf)` /
   `keptDirectives(NgFor)` (or `keptPipe(...)`) for it. Symptom: content
   that should render doesn't — `*ngFor` produces zero elements, no error
   is thrown (because `NO_ERRORS_SCHEMA` swallows it).

2. **`objectMock()`/`serviceMock()` mocks don't run real logic.** They wrap
   the given object in spies; a spy has no default implementation. If
   production code mutates state via a mocked method
   (e.g. `todo.toggleDone()` flips `done`) and then reads that state back,
   the mock won't reflect it — you must set the relevant property on the
   mock object yourself (`{ done: false }`) rather than relying on the spy
   to "do" anything.

3. **`factoryMock()` instances are consumed in call order, globally.**
   If a service's constructor already calls `factory.create()` (directly or
   via an unawaited async chain), those calls consume array entries before
   your test's own action does. Don't assume `factoryMock(..., [a, b, c])`
   means "my code under test gets `a`" unless you've accounted for
   everything upstream that also calls `create()`.

4. **Async work started in a constructor is a common source of flakiness.**
   `this.reload()` (or similar) called un-awaited from a constructor means
   any `await`/`.then()` inside it resolves as a **microtask**, not
   synchronously. A plain (non-`fakeAsync`) `beforeEach`/`it()` will *not*
   wait for it. Fix: wrap the relevant `beforeEach`/`it()` in `fakeAsync()`
   and call `flush()` after triggering construction/injection, before
   asserting. If the pending work is shared setup needed by every test in a
   `describe`, put the `fakeAsync`+`flush()` in `beforeEach` rather than
   repeating it per test.

5. **`TestBed.overrideComponent()` only works on `@Component`s.** For a
   `@Directive`, use `TestBed.overrideDirective()` — same
   `remove`/`add` shape. Passing a directive to `overrideComponent()` throws
   a `TestBedCompiler` runtime error, not a compile-time one.

6. **`TestBed.overrideProvider()` won't reach a provider declared directly
   in a `@Component`/`@Directive`'s own `providers: [...]`.** That's an
   element-injector-level provider, which shadows anything registered at
   the environment injector. Use `overrideComponent`/`overrideDirective`
   with `remove`/`add` on `providers` instead.

7. **`const` inside `beforeEach` shadows an outer `let`.** A classic copy-paste
   bug: `let fixture!: ComponentFixture<T>;` at describe-level, then
   `const fixture = TestBed.createComponent(T);` inside `beforeEach` creates
   a *new* local variable and leaves the outer one `undefined` forever.
   Watch for this whenever a test throws on `fixture.<anything>` being
   `undefined` despite `beforeEach` looking correct at a glance.

8. **`fixture()`'s `initialInputs` only accepts registered inputs.** It's
   applied via `componentRef.setInput()` (needed so signal-based `input()`
   properties work at all — assigning directly onto the instance would
   overwrite the `InputSignal` function itself with a plain value).
   `setInput()` throws if the given key isn't a known `@Input()`/`input()` on
   the component — you can't use `initialInputs` as a loose way to poke
   arbitrary state onto the instance the way a plain `Object.assign` would
   have allowed.

9. **`serviceMock()` needs a concrete mock object for an `abstract class`.**
   An abstract method has no implementation on the prototype at runtime
   (TypeScript compiles it away), so `spyOnFunctionsOf()` has nothing to spy
   there. Calling `serviceMock(MyAbstractClass)` with no second argument
   silently produces a mock missing the abstract methods entirely. Pass a
   concrete class/object that implements the shape as the second argument:
   `serviceMock(MyAbstractClass, new MyAbstractClassMock())`.

## Testing the library itself

Specs run under Jasmine/Karma (error traces reference
`projects/ng-magic-test-bed/src/...`, i.e. this package lives inside a
larger Angular workspace — the workspace-level `angular.json`/karma config
isn't part of this package's own directory). When diagnosing a failing spec,
the stack trace's `.spec.ts:LINE` reference is reliable; work from that
directly rather than guessing which file changed.

## When extending this repo

- New library feature → add/extend the matching `tests/*.integration.spec.ts`
  file first (or create one, `<feature>.integration.spec.ts`, with the
  `// Covers X()` header comment convention).
- New comparison/teaching material → `show-cases/`, as a `(magic)`/`(standard)`
  pair, standalone Angular only.
- Before adding a new integration test, check whether an existing
  `*.integration.spec.ts` already covers the scenario from a different
  angle — several rounds of cleanup have already merged duplicate
  "use-case" style tests into the atomic `tests/` files once.
