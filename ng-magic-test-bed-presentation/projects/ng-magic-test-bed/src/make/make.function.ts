
export function make(a, b) {
    const bProto = Object.getPrototypeOf(b);
    Object.setPrototypeOf(a, bProto);
    const aKeys = Object.getOwnPropertyNames(a);
    const bKeys = Object.getOwnPropertyNames(b);
    bKeys.forEach(function (key) {
        a[key] = b[key];
    });
    aKeys.forEach(function (key) {
        if (bKeys.indexOf(key) === -1) {
            delete a[key];
        }
    });
}

