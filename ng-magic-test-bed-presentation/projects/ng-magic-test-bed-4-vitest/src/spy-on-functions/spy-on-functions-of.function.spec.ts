import { spyOnFunctionsOf } from './spy-on-functions-of.function';
import { isSpy } from '../spy-framework/spy-framework';

describe('spyOnFunctionsOf', () => {

    describe('validation', () => {
        it('should throw if target is not an object', () => {
            expect(() => spyOnFunctionsOf('not an object')).toThrowError('NgMagicTestBed: expected parameter target to be object');
        });

        it('should throw if target is null', () => {
            expect(() => spyOnFunctionsOf(null)).toThrowError('NgMagicTestBed: expected parameter target to be object');
        });

        it('should throw if source is not an object', () => {
            expect(() => spyOnFunctionsOf({}, 'not an object')).toThrowError('NgMagicTestBed: expected parameter source to be object');
        });

        it('should throw if source is null', () => {
            expect(() => spyOnFunctionsOf({}, null)).toThrowError('NgMagicTestBed: expected parameter source to be object');
        });
    });

    describe('without source (target is analyzed deeply, including own properties)', () => {
        it('should create a spy for a method on a plain object', () => {
            const target = { doSomething: () => 'original' };

            spyOnFunctionsOf(target);

            expect(isSpy(target.doSomething)).toBe(true);
        });

        it('should create spies for inherited methods of a class instance', () => {
            class Base {
                baseMethod() {}
            }
            class Derived extends Base {
                derivedMethod() {}
            }
            const target: any = new Derived();

            spyOnFunctionsOf(target);

            expect(isSpy(target.baseMethod)).toBe(true);
            expect(isSpy(target.derivedMethod)).toBe(true);
        });

        it('should not create a spy for non-function properties', () => {
            const target: any = { value: 42, doSomething: () => {} };

            spyOnFunctionsOf(target);

            expect(target.value).toBe(42);
            expect(isSpy(target.doSomething)).toBe(true);
        });

        it('should return the target', () => {
            const target = { doSomething: () => {} };

            const result = spyOnFunctionsOf(target);

            expect(result).toBe(target);
        });
    });

    describe('with source (only source\'s prototype tree is analyzed, spies are created on target)', () => {
        it('should create spies on target for methods found on source', () => {
            class SourceClass {
                sourceMethod() {}
            }
            const target: any = {};
            const source = new SourceClass();

            spyOnFunctionsOf(target, source);

            expect(isSpy(target.sourceMethod)).toBe(true);
        });

        it('should also spy on own properties of an explicitly provided plain source object', () => {
            const target: any = {};
            const source = { ownMethod: () => {} };

            spyOnFunctionsOf(target, source);

            expect(isSpy(target.ownMethod)).toBe(true);
        });

        it('should additionally spy on target methods not present on source', () => {
            class SourceClass {
                sourceMethod() {}
            }
            const target: any = { targetOnlyMethod: () => {} };
            const source = new SourceClass();

            spyOnFunctionsOf(target, source);

            expect(isSpy(target.sourceMethod)).toBe(true);
            expect(isSpy(target.targetOnlyMethod)).toBe(true);
        });

        it('should return the target', () => {
            const target: any = {};
            const source = { doSomething: () => {} };

            const result = spyOnFunctionsOf(target, source);

            expect(result).toBe(target);
        });
    });

    describe('edge cases', () => {
        it('should not spy on "constructor"', () => {
            const target: any = {};
            class SourceClass {
                sourceMethod() {}
            }
            const source = new SourceClass();

            spyOnFunctionsOf(target, source);

            expect(isSpy(target.constructor)).toBe(false);
        });

        it('should stop traversing the prototype chain at Object.prototype', () => {
            const target: any = {};
            const source = { doSomething: () => {} };

            spyOnFunctionsOf(target, source);

            expect(isSpy(target.hasOwnProperty)).toBe(false);
            expect(isSpy(target.toString)).toBe(false);
        });
    });
});