
export function spyOnFunctionOf(target: any, key: string) {
    if (target[key]) {
        target[key] = jasmine.createSpy(key).and.callFake(target[key]);
    } else {
        target[key] = jasmine.createSpy(key);
    }
}
