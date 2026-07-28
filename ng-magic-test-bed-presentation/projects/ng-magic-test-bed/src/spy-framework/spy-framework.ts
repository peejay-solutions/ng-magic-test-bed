
export type Func = (...args: any[]) => any;
export type Spy<F  extends Func = Func> = jasmine.Spy<F>;
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

export function createSpy(name: string, callback?:(...ary: Array<any>)=> any): Spy{
    const spy = jasmine.createSpy(name);
    if (callback){
        spy.and.callFake(callback);
    }
    return spy;
}


