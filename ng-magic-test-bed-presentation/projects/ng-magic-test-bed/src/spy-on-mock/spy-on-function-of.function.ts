
declare const jasmine: any;
declare const jest: any;
export const spyOnFunctionOf: (target: any, key: string) => void = typeof jest !== 'undefined' ? jest.spyOn.bind(jest) : jasmineCreateSpy;

function jasmineCreateSpy(target: any, key: string) {
    target[key] = jasmine.createSpy(key).and.callFake(target[key]);
}
