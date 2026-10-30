# ng-magic-test-bed workspace

> **For maintainers.** This is the development workspace, not the user documentation. The user-facing README of the libraries lives in `projects/ng-magic-test-bed/README.md` (it ships to npm and is the home page of the API docs).

## Layout

| Path | What it is |
|---|---|
| `projects/ng-magic-test-bed` | The Jasmine library, `@peejay-solutions/ng-magic-test-bed`. **Source of truth** for everything framework-agnostic. |
| `projects/ng-magic-test-bed-4-vitest` | The Vitest library, `@ng-magic-test-bed/vitest`. Kept in sync with the Jasmine library. |
| `src` | The workspace's Angular app (`ng-magic-test-bed-presentation`). |
| `docs-landing` | Source of the static landing page that links to the two generated API docs. |

Each library has its own `llms.txt` (maintained by hand in both) and its own `src/show-cases` (see below). `projects/CLAUDE.md` and `projects/ng-magic-test-bed/CLAUDE.md` describe the porting philosophy and architecture in detail.

## Keeping the two libraries in sync

Edit framework-agnostic code **in the Jasmine library only**, then run:

```bash
npm run sync-jasmine-into-vitest
```

The script overwrites (it does not merge) `test-bed/`, `observe/`, `mock/`, `spy-on-functions/`, `tests/` and `public-api.ts` in the Vitest library. Never patch the copies. If a synced file does not compile in the Vitest library, something bypassed `spy-framework/`; fix it at the source and sync again.

Deliberately **not** synced:

- `setup-test-bed/` exists in the Jasmine library only (`NgMagicSetupTestBed`, an empty subclass of `NgMagicTestBed`). The Vitest library only has `NgMagicTestBed`. The script skips the folder and filters its export line out of `public-api.ts` while copying, so the Vitest `public-api.ts` is the Jasmine one minus that line.
- `spy-framework/` is the one place that differs. It implements the same abstraction on top of each runner's own spy primitives and is maintained by hand on both sides.
- `show-cases/` must be genuine best practice for each runner, not a mechanical translation.
- `llms.txt` and `README.md` are maintained by hand.

## Scripts

| Script | What it does |
|---|---|
| `npm run testLib` | Runs the Jasmine library tests. |
| `npm run testVitestLib` | Runs the Vitest library tests. |
| `npm run sync-jasmine-into-vitest` | Syncs the Jasmine sources into the Vitest library (see above). |
| `npm run buildLib` | Builds the Jasmine library and copies its `llms.txt` into `dist`. |
| `npm run buildVitestLib` | Builds the Vitest library and copies its `llms.txt` into `dist`. |
| `npm run compodoc` | Cleans `../docs`, generates the API docs of both libraries into `../docs/jasmine` and `../docs/vitest`, and copies the landing page to `../docs`. |

Compodoc is a devDependency (`@compodoc/compodoc`), so run `npm install` once before `npm run compodoc`. The scripts `copyLlms`, `copyLlmsVitest`, `docsJasmine`, `docsVitest` and `docsLanding` are building blocks of the scripts above. The scripts use Windows `cmd` syntax (`xcopy`, `rmdir`).

## API docs (Compodoc)

The API docs are for **users** of the libraries, so they contain only the public API:

- Compodoc runs once per library, from inside the library folder. It uses that library's `README.md` as the home page and its `tsconfig.doc.json` as the source list. The source list contains only folders that `public-api.ts` exports from; `show-cases/`, `tests/` and `spy-framework/` are left out.
- Implementation details are hidden with a `@internal` JSDoc tag together with the `--disableInternal` flag. Tag every new helper class or function that is not part of the public API with `@internal`.
- When you add a new folder to `public-api.ts`, add it to both `tsconfig.doc.json` files too.
- The output goes to `../docs`, one level above the workspace.

## Releasing a library

1. Update the version in the library's `package.json` and the `llms.txt` if the API changed.
2. `npm run buildLib` or `npm run buildVitestLib`.
3. `cd dist/<library>` and `npm publish`.
