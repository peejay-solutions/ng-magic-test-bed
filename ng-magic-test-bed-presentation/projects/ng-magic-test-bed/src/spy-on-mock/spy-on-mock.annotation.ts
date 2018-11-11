import { spyOnMethodsOf } from './spy-on-mock.function';

export function spyOnMock() {
    return function (cls) {
        spyOnMethodsOf(cls.prototype);
        return cls;
    };
}
