import { Observable } from 'rxjs';

export class SpyObserver<T> {
    public readonly next: jasmine.Spy;
    public readonly error: jasmine.Spy;
    public readonly complete: jasmine.Spy;
    public readonly observations: Array<T> = [];
    public get latest(): T {
        return this.observations[this.observations.length - 1];
    }

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
