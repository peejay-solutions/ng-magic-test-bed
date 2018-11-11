import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { make } from '../make/make.function';
import { spyOnMethodsOf } from '../spy-on-mock/spy-on-mock.function';

interface IInjectionMeta {
    instance: any;
    Service: Type<any>;
}

interface IMockMeta extends IInjectionMeta {
    Mock: Type<any>;
}

export class NgMagicTestBed {

    private mocks: IMockMeta[] = [];
    private injections: IInjectionMeta[] = [];
    private dontSpy = false;

    public happen = this.reset.bind(this);

    public mock<M>(Service: Type<any>, Mock: Type<M>, dontSpy: boolean = false): M {
        this.dontSpy = dontSpy;
        if (!this.dontSpy) {
            spyOnMethodsOf(Mock.prototype, true);
        }
        const instance = new Mock();
        if (!this.dontSpy) {
            spyOnMethodsOf(instance);
        }
        const mockMeta: IMockMeta = {
            instance: instance,
            Mock: Mock,
            Service: Service
        };
        this.mocks.push(mockMeta);
        return instance;
    }

    public injection<S>(Service: Type<S>): S {
        const instance = new Service();
        const injectionMeta: IInjectionMeta = {
            instance: instance,
            Service: Service
        };
        this.injections.push(injectionMeta);
        return instance;
    }

    public reset() {
        const providers = [];
        this.mocks.forEach(mockMeta => {
            const newInstance = new mockMeta.Mock();
            if (!this.dontSpy) {
                spyOnMethodsOf(newInstance);
            }
            make(mockMeta.instance, newInstance);
            const provider = {
                useValue: mockMeta.instance,
                provide: mockMeta.Service
            };
            providers.push(provider);
        });
        TestBed.configureTestingModule({
            providers: providers
        });
        this.injections.forEach(injectionMeta => {
            const newInstance = TestBed.get(injectionMeta.Service);
            make(injectionMeta.instance, newInstance);
        });
    }
}
