declare const jasmine: any;

export function spyOnMethodsOf(target: any, deep: boolean = false) {
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
        currentPrototype = deep ? Object.getPrototypeOf(currentPrototype) : false;
    }
    keys.forEach(key => {
        target[key] = jasmine.createSpy(key).and.callFake(target[key]);
    });
}
