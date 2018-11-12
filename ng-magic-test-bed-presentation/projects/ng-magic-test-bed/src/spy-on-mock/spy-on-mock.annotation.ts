import { spyOnFunctionsOf } from './spy-on-functions-of.function';

export function spyOnMock() {
    return function (cls) {
        spyOnFunctionsOf(cls.prototype);
        return cls;
    };
}
