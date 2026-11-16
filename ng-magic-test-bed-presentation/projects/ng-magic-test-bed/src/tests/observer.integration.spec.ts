import { Subject } from 'rxjs';
import { NgMagicTestBed } from '../public-api';
import { getSpyName } from '../spy-framework/spy-framework';

// Covers observer(observable, name?)
// Subscribes to an observable and returns a SpyObserver with spies for
// next/error/complete plus a running "observations" array and a "latest" getter.
// unsubscribe() stops the observation again.

describe('observer()', () => {

    it('next spy should be called for every emission, in order', () => {
        const magic = new NgMagicTestBed();
        const subject = new Subject<number>();
        const observer = magic.observer(subject);

        subject.next(1);
        subject.next(2);

        expect(observer.next).toHaveBeenCalledTimes(2);
        expect(observer.next).toHaveBeenCalledWith(1);
        expect(observer.next).toHaveBeenCalledWith(2);
    });

    it('observations should collect every emitted value, and latest should be the most recent one', () => {
        const magic = new NgMagicTestBed();
        const subject = new Subject<string>();
        const observer = magic.observer(subject);

        subject.next('a');
        subject.next('b');

        expect(observer.observations).toEqual(['a', 'b']);
        expect(observer.latest).toBe('b');
    });

    it('complete spy should be called when the observable completes', () => {
        const magic = new NgMagicTestBed();
        const subject = new Subject<void>();
        const observer = magic.observer(subject);

        subject.complete();

        expect(observer.complete).toHaveBeenCalled();
    });

    it('error spy should be called with the error when the observable errors', () => {
        const magic = new NgMagicTestBed();
        const subject = new Subject<void>();
        const observer = magic.observer(subject);
        const error = new Error('boom');

        subject.error(error);

        expect(observer.error).toHaveBeenCalledWith(error);
    });

    it('an optional name should prefix the underlying spies for easier-to-read failures', () => {
        const magic = new NgMagicTestBed();
        const subject = new Subject<void>();

        const observer = magic.observer(subject, 'myObservable');

        expect(getSpyName(observer.next)).toContain('myObservable.next');
    });

    it('unsubscribe() should stop recording, but keep what was recorded so far', () => {
        const magic = new NgMagicTestBed();
        const subject = new Subject<number>();
        const observer = magic.observer(subject);

        subject.next(1);
        observer.unsubscribe();
        subject.next(2);
        subject.complete();

        expect(observer.observations).toEqual([1]);
        expect(observer.latest).toBe(1);
        expect(observer.next).toHaveBeenCalledTimes(1);
        expect(observer.complete).not.toHaveBeenCalled();
    });

    it('unsubscribe() can be called more than once', () => {
        const magic = new NgMagicTestBed();
        const observer = magic.observer(new Subject<number>());

        observer.unsubscribe();

        expect(() => observer.unsubscribe()).not.toThrow();
    });

});
