#!/usr/bin/env node
/**
 * Syncs the framework-agnostic parts of ng-magic-test-bed (Jasmine) into
 * this project (Vitest). Deliberately excludes:
 *   - show-cases/    (must be genuine, framework-idiomatic best practice on
 *                      each side, never a mechanical translation - see
 *                      ../ng-magic-test-bed/CLAUDE.md and ../CLAUDE.md)
 *   - spy-framework/  (the one place that's allowed to differ - implements
 *                      the same abstraction (spyFunctionOf, createSpy, isSpy,
 *                      makeSpyReturnValue, getSpyName, Spy<T>, SpyObj<T>) on
 *                      top of each framework's own primitives, maintained by
 *                      hand on both sides so everything else can rely on it)
 *
 * Everything copied here works unmodified in both projects specifically
 * *because* it only ever calls the spy-framework abstraction - never a
 * jasmine or vitest global directly. If a synced file doesn't compile or
 * run after this script, that usually means something new slipped in that
 * bypasses spy-framework - fix it at the source (ng-magic-test-bed) and
 * re-run, don't patch the copy.
 *
 * Usage: npm run sync:jasmine-source
 */

import { cpSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SOURCE_ROOT = join(__dirname, '..', '..', 'ng-magic-test-bed', 'src');
const TARGET_ROOT = join(__dirname, '..', 'src');

const FOLDERS_TO_SYNC = [
    'test-bed',
    'observe',
    'mock',
    'spy-on-functions',
    'tests',
];

const FILES_TO_SYNC = [
    'public-api.ts',
];

if (!existsSync(SOURCE_ROOT)) {
    console.error(`Source not found: ${SOURCE_ROOT}`);
    console.error('Expected ng-magic-test-bed to be a sibling of this project.');
    process.exit(1);
}

for (const folder of FOLDERS_TO_SYNC) {
    const source = join(SOURCE_ROOT, folder);
    const target = join(TARGET_ROOT, folder);
    if (!existsSync(source)) {
        console.warn(`Skipping missing source folder: ${source}`);
        continue;
    }
    // Remove the target folder first so files deleted on the jasmine side
    // (e.g. a renamed test) don't linger here as stale copies.
    if (existsSync(target)) {
        rmSync(target, { recursive: true, force: true });
    }
    cpSync(source, target, { recursive: true });
    console.log(`Synced ${folder}/`);
}

for (const file of FILES_TO_SYNC) {
    const source = join(SOURCE_ROOT, file);
    const target = join(TARGET_ROOT, file);
    if (!existsSync(source)) {
        console.warn(`Skipping missing source file: ${source}`);
        continue;
    }
    cpSync(source, target);
    console.log(`Synced ${file}`);
}

console.log('\nDone. Diff the result before committing - this overwrites, it does not merge.');
