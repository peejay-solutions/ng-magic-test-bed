
declare const jest: any;
export const spyOnFunctionOf: (target: any, key: string) => void = typeof jest !== 'undefined' ? jest.spyOn.bind(jest) : jasmineCreateSpy;

function jasmineCreateSpy(target: any, key: string) {
    if (target[key]) {
        target[key] = jasmine.createSpy(key).and.callFake(target[key]);
    } else {
        target[key] = jasmine.createSpy(key);
    }
}
