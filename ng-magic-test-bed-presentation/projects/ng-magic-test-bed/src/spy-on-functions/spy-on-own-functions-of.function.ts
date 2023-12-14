import { spyOnFunctionOf } from './spy-on-function-of.function';

export function spyOnOwnFunctionsOf(target: any) {
    const keys = Object.getOwnPropertyNames(target).filter(key => {
        return typeof target[key] === 'function' && key !== 'constructor';
    });
    keys.forEach(key => {
        spyOnFunctionOf(target, key);
    });
}
