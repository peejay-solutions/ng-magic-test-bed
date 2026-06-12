
export type Spy = jasmine.Spy;
export type SpyObj<T> = jasmine.SpyObj<T>;


export function spyFunctionOf(target: any, key: string) {
    if (jasmine.isSpy(target[key])){
        return;
    }
    if (!target[key]){
        target[key] = () => {};
    }
    spyOn(target, key).and.callThrough();
}


