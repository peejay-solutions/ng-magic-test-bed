
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

export function createSpy(name: string, callback?:(...ary: Array<any)=> any): Spy{
    const spy = jasmine.createSpy(name);
    if (callback){
        spy.and.callFake(callback);
    }
    return spy;
}


