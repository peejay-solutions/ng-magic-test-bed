
import { Type } from '@angular/core';
import {vi, Mock} from 'vitest';

export type Func = (...args: any[]) => any;
export type Spy<F extends Func = Func> = Mock<F>;
export type SpyObj<T extends Type<any> > = Mock<T>

export function spyFunctionOf(target: any, key: string) {
    if (vi.isMockFunction(target[key])){
        return;
    }
    if (!target[key]){
        target[key] = () => {};
    }
    vi.spyOn(target, key);
}

export function createSpy(name: string, callback?:(...ary: Array<any>)=> any): Spy{
    const spy = vi.fn(callback);
    spy.mockName(name);
    return spy;
}


