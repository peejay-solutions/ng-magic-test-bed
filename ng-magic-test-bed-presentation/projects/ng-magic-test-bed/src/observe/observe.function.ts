import { Observable } from 'rxjs';


export function observe<T>(observable: Observable<T>, name?: string) {
    return new SpyObserver<T>(observable, name);
}

export class SpyObserver<T> {
    public readonly next: jasmine.Spy;
    public readonly error: jasmine.Spy;
    public readonly complete: jasmine.Spy;
    public readonly values: Array<T> = [];
    public get latest(): T {
        return this.values[this.values.length - 1];
    }

    constructor(observable: Observable<T>, name?: string) {
        const prefix = name ? name + '.' : '';
        this.next = jasmine.createSpy(prefix + 'next');
        this.error = jasmine.createSpy(prefix + 'error');
        this.complete = jasmine.createSpy(prefix + 'complete:');
        this.values = new Array<T>();
        observable.subscribe(next => {
            this.values.push(next);
            this.next(next);
        }, this.error, this.complete);
    }

}
