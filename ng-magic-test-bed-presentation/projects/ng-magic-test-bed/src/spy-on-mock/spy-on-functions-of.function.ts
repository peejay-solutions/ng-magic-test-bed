import { spyOnFunctionOf } from './spy-on-function-of.function';

export function spyOnFunctionsOf(target: any) {
    if (typeof target !== 'object') {
        throw new Error('NgMagicTestBed: expected parameter target to be object');
    }
    const keys = [];
    let currentPrototype = target;
    while (currentPrototype && currentPrototype.constructor !== Object && currentPrototype.constructor !== Array) {
        const newKeys = Object.getOwnPropertyNames(currentPrototype);
        newKeys.forEach(key => {
            if (key !== 'constructor' && keys.indexOf(key) < 0 && typeof target[key] === 'function') {
                keys.push(key);
            }
        });
        currentPrototype = Object.getPrototypeOf(currentPrototype);
    }
    keys.forEach(key => {
        spyOnFunctionOf(target, key);
    });
}
