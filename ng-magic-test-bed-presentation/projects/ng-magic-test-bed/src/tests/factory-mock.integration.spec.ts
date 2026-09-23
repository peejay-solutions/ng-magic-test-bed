import { Injectable } from '@angular/core';
import { NgMagicTestBed } from '../public-api';

// Covers factoryMock(factoryClass, instances)
// Use this for injectable services that follow the "factory" pattern: a
// public create() method that builds instances of another class.
// IMPORTANT (documented anti-pattern in llms.txt): use the RETURN VALUE of
// factoryMock() directly - do not fetch the factory again via injection().

class Widget {
    constructor(public readonly id: string) {}
}

@Injectable({ providedIn: 'root' })
class WidgetFactory {
    public create(_config: { size: number }): Widget {
        throw new Error('should never run for a mocked factory');
    }
}

describe('factoryMock()', () => {

    it('create() should return the given instances in order, one per call', () => {
        const magic = new NgMagicTestBed();
        const first = new Widget('first');
        const second = new Widget('second');
        const widgetFactoryMock = magic.factoryMock(WidgetFactory, [first, second]);

        const firstResult = widgetFactoryMock.create({ size: 1 });
        const secondResult = widgetFactoryMock.create({ size: 2 });

        expect(firstResult).toBe(first);
        expect(secondResult).toBe(second);
    });

    it('create is a jasmine spy - its calls can be inspected like any other spy', () => {
        const magic = new NgMagicTestBed();
        const widgetFactoryMock = magic.factoryMock(WidgetFactory, [new Widget('only')]);

        widgetFactoryMock.create({ size: 42 });

        expect(widgetFactoryMock.create).toHaveBeenCalledWith({ size: 42 });
    });

    it('calling create() more often than instances were provided returns undefined', () => {
        const magic = new NgMagicTestBed();
        const widgetFactoryMock = magic.factoryMock(WidgetFactory, [new Widget('only')]);

        widgetFactoryMock.create({ size: 1 });
        const thirdCallResult = widgetFactoryMock.create({ size: 2 });

        expect(thirdCallResult).toBeUndefined();
    });

    it('should register the mock in DI so a consumer of WidgetFactory gets it via constructor injection', () => {
        const magic = new NgMagicTestBed();
        const widget = new Widget('injected');
        const widgetFactoryMock = magic.factoryMock(WidgetFactory, [widget]);

        // Some other service that depends on WidgetFactory would receive this
        // mock automatically. We simulate that here by injecting the token
        // ourselves - in real specs you would instead call magic.injection(TheConsumingService).
        const injectedFactory = magic.injection(WidgetFactory);

        expect(injectedFactory).toBe(widgetFactoryMock as any);
        expect(injectedFactory.create({ size: 1 })).toBe(widget);
    });

});
