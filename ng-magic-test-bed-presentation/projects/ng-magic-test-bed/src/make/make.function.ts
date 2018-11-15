
export function make(a, b) {
    const bProto = Object.getPrototypeOf(b);
    Object.setPrototypeOf(a, bProto);
    const aKeys = Object.getOwnPropertyNames(a);
    const bKeys = Object.getOwnPropertyNames(b);
    const bDescriptors = Object.getOwnPropertyDescriptors(b);
    Object.defineProperties(a, bDescriptors);
    aKeys.forEach(function (key) {
        if (bKeys.indexOf(key) === -1) {
            delete a[key];
        }
    });
}
