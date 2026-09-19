import { Component, output } from '@angular/core';
import { NgMagicSetupTestBed } from '../public-api';
import { getSpyName } from '../spy-framework/spy-framework';

// Covers outputObserver(output, name?)
// Like observer(), but for Angular's signal-based output() API
// (OutputEmitterRef<T>) instead of a plain Observable. Internally converts
// the OutputEmitterRef via outputToObservable() and wraps it the same way
// observer() wraps an Observable, so it gives you the same SpyObserver
// (next/error/complete spies, observations array, latest getter).

@Component({
    selector: 'counter-widget',
    standalone: true,
    template: '',
})
class CounterWidgetComponent {
    public readonly countChanged = output<number>();
}

describe('outputObserver()', () => {

    it('next spy should be called for every emission, in order', () => {
        const magic = new NgMagicSetupTestBed();
        const fixture = magic.fixture(CounterWidgetComponent);
        const observer = magic.outputObserver(fixture.componentInstance.countChanged);

        fixture.componentInstance.countChanged.emit(1);
        fixture.componentInstance.countChanged.emit(2);

        expect(observer.next).toHaveBeenCalledTimes(2);
        expect(observer.next).toHaveBeenCalledWith(1);
        expect(observer.next).toHaveBeenCalledWith(2);
    });

    it('observations should collect every emitted value, and latest should be the most recent one', () => {
        const magic = new NgMagicSetupTestBed();
        const fixture = magic.fixture(CounterWidgetComponent);
        const observer = magic.outputObserver(fixture.componentInstance.countChanged);

        fixture.componentInstance.countChanged.emit(10);
        fixture.componentInstance.countChanged.emit(20);

        expect(observer.observations).toEqual([10, 20]);
        expect(observer.latest).toBe(20);
    });

    it('should be usable without a name, same as observer()', () => {
        const magic = new NgMagicSetupTestBed();
        const fixture = magic.fixture(CounterWidgetComponent);

        expect(() => magic.outputObserver(fixture.componentInstance.countChanged)).not.toThrow();
    });

    it('an optional name should prefix the underlying spies, same as observer()', () => {
        const magic = new NgMagicSetupTestBed();
        const fixture = magic.fixture(CounterWidgetComponent);

        const observer = magic.outputObserver(fixture.componentInstance.countChanged, 'countChanged');

        expect(getSpyName(observer.next)).toContain('countChanged.next');
    });

});
