
import { vi, Mock } from 'vitest';

export type Func = (...args: any[]) => any;
export type Spy<F extends Func = Func> = Mock<F>;
export type SpyObj<T> = T & {
    [K in keyof T]: T[K] extends Func ? Mock<T[K]> : T[K];
};

export function spyFunctionOf(target: any, key: string) {
    if (vi.isMockFunction(target[key])){
        return;
    }
    if (!target[key]){
        target[key] = () => {};
    }
    vi.spyOn(target, key);
    target[key].mockName(key);
}

export function createSpy(name: string, callback?:(...ary: Array<any>)=> any): Spy{
    const spy = vi.fn(callback);
    spy.mockName(name);
    return spy;
}

export function isSpy(method: Func){
    return vi.isMockFunction(method);
}


export function makeSpyReturnValue<T>(spy: Spy<(...args: Array<any>)=>T>, value: T){
    spy.mockReturnValue(value);
}

export function getSpyName(spy: Spy){
    return spy.getMockName();
}




