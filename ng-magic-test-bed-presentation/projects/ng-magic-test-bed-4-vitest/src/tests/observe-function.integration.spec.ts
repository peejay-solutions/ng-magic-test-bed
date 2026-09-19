import { Subject } from 'rxjs';
import { observe } from '../public-api';
import { getSpyName } from '../spy-framework/spy-framework';

// Covers the standalone observe(observable, name?) function.
// magic.observer() is a thin wrapper around exactly this function
// (`public observer<T>(observable, name?) { return observe(observable, name); }`),
// so behavior is identical - use this version when you don't have (or don't
// need) an NgMagicSetupTestBed instance.

describe('observe()', () => {

    it('should track emissions the same way magic.observer() does', () => {
        const subject = new Subject<number>();

        const spyObserver = observe(subject);
        subject.next(1);
        subject.next(2);

        expect(spyObserver.observations).toEqual([1, 2]);
        expect(spyObserver.latest).toBe(2);
    });

    it('should prefix its spies with the given name', () => {
        const subject = new Subject<void>();

        const spyObserver = observe(subject, 'myStream');

        expect(getSpyName(spyObserver.next)).toContain('myStream.next');
    });

});
