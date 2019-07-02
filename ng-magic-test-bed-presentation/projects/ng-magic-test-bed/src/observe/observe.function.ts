import { Observable } from 'rxjs';


declare module jasmine {
    export type SpyObj<T> = { [key in keyof T]: Spy } & T;

    export interface Spy {
        (...params: any[]): any;

        identity: string;
        and: SpyAnd;
        calls: Calls;
        mostRecentCall: { args: any[]; };
        argsForCall: any[];
    }

    export interface SpyAnd {
        callThrough(): Spy;
        returnValue(val: any): Spy;
        returnValues(...values: any[]): Spy;
        callFake(fn: Function): Spy;
        throwError(msg: string): Spy;
        stub(): Spy;
    }

    export interface Calls {
        any(): boolean;
        count(): number;
        argsFor(index: number): any[];
        allArgs(): any[];
        all(): CallInfo[];
        mostRecent(): CallInfo;
        first(): CallInfo;
        reset(): void;
    }

    export interface CallInfo {
        object: any;
        args: any[];
        returnValue: any;
    }

    export function createSpy(name: string): Spy;
}

export function observe<T>(observable: Observable<T>, name?: string) {
    return new SpyObserver<T>(observable, name);
}

export class SpyObserver<T> {
    public readonly next: jasmine.Spy;
    public readonly error: jasmine.Spy;
    public readonly complete: jasmine.Spy;
    public readonly observations: Array<T> = [];

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
