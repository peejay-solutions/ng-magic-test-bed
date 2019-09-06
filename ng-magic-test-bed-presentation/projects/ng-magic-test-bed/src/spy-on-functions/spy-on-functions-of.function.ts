import { spyOnFunctionOf } from './spy-on-function-of.function';

export function spyOnFunctionsOf(target: any, source?: any) {
    if (typeof target !== 'object' || target === null) {
        throw new Error('NgMagicTestBed: expected parameter target to be object');
    }
    if (typeof source === 'undefined') {
        source = target;
    }
    if (typeof source !== 'object' || source === null) {
        throw new Error('NgMagicTestBed: expected parameter source to be object');
    }
    const sourceKeys = getMethodKeysFromObject(source);
    const targetKeys = getMethodKeysFromObject(target);
    sourceKeys.forEach(key => {
        spyOnFunctionOf(target, key);
    });
    targetKeys.forEach(key => {
        if (sourceKeys.includes(key)) {
            return;
        }
        spyOnFunctionOf(target, key);
    });
    return target;
}

function getMethodKeysFromObject(obj: any) {
    const keys = [];
    let currentPrototype = obj;
    while (currentPrototype && currentPrototype.constructor !== Object && currentPrototype.constructor !== Array) {
        const newKeys = Object.getOwnPropertyNames(currentPrototype);
        newKeys.forEach(key => {
            try {
                if (key !== 'constructor' && keys.indexOf(key) < 0 && typeof obj[key] === 'function') {
                    keys.push(key);
                }
            } catch (e) {

            }
        });
        currentPrototype = Object.getPrototypeOf(currentPrototype);
    }
    return keys;
}
