import { Observable } from 'rxjs';

/**
 * @description
 * Subscribes to a given observable and tracks all observations.
 */
export class SpyObserver<T> {
    /**
     * @description
     * jasmine spy that will be called when the observable emits a value.
     * Can be uses like this: expect(observer.next).toHaveBeenCalledWith(expectedValue);
     */
    public readonly next: jasmine.Spy;
     /**
     * @description
     * jasmine spy that will be called when the observable throws an error
     * Can be uses like this: expect(observer.next).toHaveBeenCalledWith(expectedError);
     */
    public readonly error: jasmine.Spy;
    /**
     * @description
     * jasmine spy that will be called when the observable completes
     * Can be uses like this: expect(observer.complete).toHaveBeenCalled();
     */
    public readonly complete: jasmine.Spy;
    /**
     * @description
     * When the observable emits a value, it will be pushed onto this array.
     */
    public readonly observations: Array<T> = [];
     /**
     * @description
     * refers to the latest emitted value of the observable.
     */
    public get latest(): T {
        return this.observations[this.observations.length - 1];
    }
    /**
     * @param observable
     * The observable that you want to spy with this observer instance.
     * @param name
     * Optional name that prefixes all jasmine spies that are created by the observer. This makes it easier to read the
     * test output if anything fails.
     */
    constructor(observable: Observable<T>, name?: string) {
        const prefix = name ? name + '.' : '';
        this.next = jasmine.createSpy(prefix + 'next');
        this.error = jasmine.createSpy(prefix + 'error');
        this.complete = jasmine.createSpy(prefix + 'complete:');
        this.observations = new Array<T>();
        observable.subscribe(next => {
            this.observations.push(next);
            this.next(next);
        }, this.error, this.complete);
    }

}
