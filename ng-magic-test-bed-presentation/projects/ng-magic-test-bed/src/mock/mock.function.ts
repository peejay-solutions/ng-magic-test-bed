import { AbstractType } from '@angular/core';
import { spyOnFunctionsOf } from '../spy-on-functions/spy-on-functions-of.function';

    /**
     * Can be used to create a mock for an object that is an instance of a class.
     * @param objectClass This class' prototype will be used to extend the result mock by a spy for each method on the prototype.
     * @param mock An object that should implement partial of objectClass and contain all methods that you want to return something.
     * @param dontSpy optional parameter to prevent the default spy creation on the mock.
     * @returns Your mocks methods will be overwritten with spies that call through to the mocks methods like jasmine's spyOn method.
     * In addition to that a spy will be added for each additional method that was found on the objectClass' prototype.
     */

export function mock<S, M extends Partial<S>>( spySource?: AbstractType<S>, mock: M = <any>{}, dontSpy?: boolean):
    S & M | jasmine.SpyObj<S> & M | jasmine.SpyObj<S> {
    if (!dontSpy) {
        spyOnFunctionsOf(mock, spySource ? spySource.prototype : undefined);
    }

    return <any>mock;
}