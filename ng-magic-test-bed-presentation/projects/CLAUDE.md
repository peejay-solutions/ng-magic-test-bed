# CLAUDE.md — projects/ (workspace root)

This directory holds two sibling Angular testing-utility libraries. This
file orients Claude across both; each library also has (or should have)
its own CLAUDE.md with library-specific detail.

## The two projects

- **`ng-magic-test-bed/`** — the original, mature library. Test framework:
  **Jasmine**. Has its own `CLAUDE.md` at its root — read that for its
  internal architecture, directory layout, and known gotchas. Package name:
  `@peejay-solutions/ng-magic-test-bed`.

- **`ng-magic-test-bed-4-vitest/`** — a from-scratch **Vitest** port of the
  same library, started because Jasmine and Vitest are similar enough to
  share the *concept* but too different to share the *package* (different
  spy/mock APIs, different globals). Package name is currently
  `ng-magic-test-bed-4-vitest` — the person intends to pick a better npm
  name at some point; nothing has been renamed yet, don't assume a new name
  without being told what it is.

Jest is a plausible third target later but is explicitly **not** a current
priority — Angular's own tooling has moved to Vitest, and Jasmine is
expected to fade out over time. Don't build Jest support speculatively.

## Porting philosophy — this is the part that matters most

The two libraries are kept in **structural lockstep** for their
implementation and their own regression tests, but **not** for their
teaching/comparison material. Two different rules apply depending on which
part of the tree you're touching:

### 1. Library internals + `tests/` → port 1:1, mechanically

`spy-framework/`, `spy-on-functions/`, `mock/`, `observe/`, `test-bed/`,
and `tests/` (the atomic `*.integration.spec.ts` regression suite) should
stay **structurally identical** between the two projects — same file
names, same folder layout, same test cases, same assertions. Only the
test-framework-specific API calls change. This is deliberate: these tests
prove the two libraries behave the same way, so a structural difference
here would raise the question "does the library actually behave
differently?" even when the answer is no.

When porting a file from `ng-magic-test-bed` to `ng-magic-test-bed-4-vitest`
(or vice versa), the translation table below is what to apply. Nothing else
should change - if a ported file's logic doesn't diff cleanly against the
original (modulo these substitutions), stop and figure out why before
proceeding, don't quietly rewrite the test.

### 2. `show-cases/` → do NOT port 1:1

`show-cases/` exists to demonstrate realistic, current best practice for
each framework - both the `(magic)` and the `(standard)` variant of every
comparison pair. This is not the place for a mechanical Jasmine→Vitest
find-and-replace:

- The **`(standard)`** variant must be written the way a competent
  developer working natively in that framework would actually write it
  today - not a line-by-line translation of the other framework's
  `(standard)` spec. A translated file would misrepresent what "best
  practice" looks like and would quietly corrupt any LOC/quality
  comparison built from it (see `ng-magic-test-bed/CLAUDE.md` and
  `ng-magic-test-bed/docs/metrics-magic-vs-standard.md` if present - a
  whole metrics exercise was built on the Jasmine side specifically to
  compare Magic against a *genuine* best-practice standard baseline, and
  that only holds up if the baseline is genuine).
- The **`(magic)`** variant can stay close in structure between the two
  ports, since `NgMagicSetupTestBed`'s own API surface is the whole point
  of being framework-agnostic - but still double check idiomatic details
  (e.g. whether `beforeEach` vs. a local `setup()` function is more
  natural in each ecosystem) rather than assuming a straight copy is right.
- **As of this writing, `show-cases/` has not been ported to
  `ng-magic-test-bed-4-vitest` at all.** Only `test-bed/`, `observe/`,
  `spy-framework/`, `mock/`, `spy-on-functions/`, and `tests/` have been
  ported. This is deliberate, not an oversight - see "Current port status"
  below.

## Jasmine → Vitest translation table

Worked out carefully while porting `tests/` - use this rather than
re-deriving it, and extend it here if a new idiom shows up.

| Jasmine | Vitest |
|---|---|
| `jasmine.isSpy(x)` | `vi.isMockFunction(x)` |
| `jasmine.createSpy('name')` | `vi.fn()` |
| `jasmine.createSpy('name').and.returnValue(x)` | `vi.fn().mockReturnValue(x)` |
| `spy.and.callFake(fn)` | `spy.mockImplementation(fn)` |
| `spy.and.returnValues(a, b, c)` | `spy.mockReturnValueOnce(a).mockReturnValueOnce(b).mockReturnValueOnce(c)` (no direct multi-arg equivalent - chain `.mockReturnValueOnce()`) |
| bare `spyOn(obj, 'key')` (Jasmine global) | `vi.spyOn(obj, 'key')` |
| `.toBeTrue()` / `.toBeFalse()` | `.toBe(true)` / `.toBe(false)` (Vitest's expect has no Jasmine-style boolean shorthands) |
| `jasmine.SpyObj<T>` | local `SpyObj<T>` from `spy-framework.ts` - see gotcha below, this is NOT a trivial rename |
| `describe`/`it`/`expect` as ambient globals | Import explicitly from `'vitest'` even though `tsconfig.spec.json` sets `types: ["vitest/globals"]` - this repo's convention (established in the hand-written `mock-component.function.spec.ts`) is explicit imports; follow it for consistency rather than relying on the globals typing. |

`fakeAsync`/`tick`/`flush` from `@angular/core/testing` were not
encountered anywhere in `tests/` as of this port, so there's no established
translation for them yet. If `show-cases/` porting hits one (the Jasmine
`todo.service(magic).spec.ts` uses `fakeAsync`+`flush`), verify whether
Angular's zone.js-based fakeAsync still works unmodified under Vitest
before assuming it just works - it's zone.js-level monkeypatching, not
Jasmine-specific, but hasn't actually been exercised under Vitest here yet.

## A real bug found while porting - watch for regressions here

`ng-magic-test-bed-4-vitest/src/spy-framework/spy-framework.ts` had:
```typescript
export type SpyObj<T extends Type<any>> = Mock<T>
```
This is wrong on two counts: `Mock<T>` is Vitest's type for *one mocked
function* with call signature `T` - not for "an object with every method
replaced by a spy", which is what `SpyObj<T>` actually needs to mean (and
what Jasmine's own `SpyObj<T>` means). The `T extends Type<any>` constraint
compounded this by requiring `T` to be a class constructor, when call sites
always pass an instance/object shape. The combination silently broke
type-checking for `mock()`, `objectMock()`, `serviceMock()`, and anything
else returning a `SpyObj<...>`. Fixed to a proper per-property mapped type:
```typescript
export type SpyObj<T> = T & {
    [K in keyof T]: T[K] extends Func ? Mock<T[K]> : T[K];
};
```
`mock.function.ts`'s matching `S extends Type<any>` constraint (added as a
workaround for the above) was reverted at the same time - don't reintroduce
either of these constraints.

## Current port status (ng-magic-test-bed-4-vitest)

Ported and structurally matching `ng-magic-test-bed`:
- `spy-framework/`, `spy-on-functions/`, `mock/` (pre-existing, `mock.function.ts`'s type bug fixed)
- `test-bed/`, `observe/` (newly ported; `spy-observer.class.ts` needed the bare-`spyOn`→`vi.spyOn` fix)
- `tests/` (all 22 files, mechanically translated per the table above)
- `public-api.ts` rebuilt to mirror `ng-magic-test-bed`'s export list

Removed: `src/lib/ng-magic-test-bed-4-vitest.ts` (+ its spec) - the
Angular-CLI-generated placeholder "works!" component scaffold, unrelated to
the library's actual purpose.

Not yet ported: `show-cases/` (see "Porting philosophy" above for why this
isn't a mechanical copy job), `docs/` (the metrics report, if written on
the Jasmine side), `llms.txt` (the Jasmine side's API reference - the
Vitest side will need its own once its public API stabilizes, not a
straight copy since method signatures may end up differing slightly, e.g.
around `SpyObj`).

## Open decisions (not yet acted on)

- **Package name**: `ng-magic-test-bed-4-vitest` is a working name, not
  final. The person plans to pick something better. Don't rename
  proactively - wait for an explicit new name.
