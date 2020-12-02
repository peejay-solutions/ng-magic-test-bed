import { Observable } from 'rxjs';
import { SpyObserver } from './spy-observer.class';

/**
 * @description
 * Subscribes a given observable and spies on its states and emitted values.
 * @param observable
 * Observable you want to spy
 * @param name
 * Optional name that prefixes all jasmine spies that are created by the observer. This makes it easier to read the
 * test output if anything fails.
 * @returns
 * observer that can be used to make assertions in your test cases e.g.:
 * expect(observer.next).toHaveBeenCalledWith(expectedValue);
 */
export function observe<T>(observable: Observable<T>, name?: string) {
    return new SpyObserver<T>(observable, name);
}
