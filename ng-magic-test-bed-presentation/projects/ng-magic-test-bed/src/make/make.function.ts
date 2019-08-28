
export function make(a, b) {
    const bProto = Object.getPrototypeOf(b);
    Object.setPrototypeOf(a, bProto);
    const aKeys = Object.getOwnPropertyNames(a);
    const bKeys = Object.getOwnPropertyNames(b);
    const bDescriptors = Object.getOwnPropertyDescriptors(b);
    bKeys.forEach(bKey => {
        const descriptor = bDescriptors[bKey];
        if (descriptor.writable && !descriptor.hasOwnProperty('get')) {
            bDescriptors[bKey] = {
                configurable: descriptor.configurable,
                enumerable: descriptor.enumerable,
                get: () => b[bKey],
                set: (newValue) => b[bKey] = newValue,
            };
        }
    });
    Object.defineProperties(a, bDescriptors);
    aKeys.forEach(function (key) {
        if (bKeys.indexOf(key) === -1) {
            delete a[key];
        }
    });
}
