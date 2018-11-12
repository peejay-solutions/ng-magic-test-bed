import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { make } from '../make/make.function';
import { spyOnFunctionsOf } from '../spy-on-mock/spy-on-functions-of.function';
import { spyOnOwnFunctionsOf } from '../spy-on-mock/spy-on-own-functions-of.function';

interface IInjectionMeta {
    instance: any;
    Service: Type<any>;
}

interface IMockMeta extends IInjectionMeta {
    forwardMock: () => Type<any>;
    Mock: Type<any>;
    doSpy: boolean;
}

export class NgMagicTestBed {

    private mocks: IMockMeta[] = [];
    private injections: IInjectionMeta[] = [];

    public happen = this.reset.bind(this);

    public mock<M>(Service: Type<any>, forwardMock: () => Type<M>, dontSpy: boolean = false): M {
        const mockMeta: IMockMeta = {
            instance: {},
            Mock: null,
            forwardMock: forwardMock,
            Service: Service,
            doSpy: !dontSpy
        };
        this.mocks.push(mockMeta);
        return mockMeta.instance;
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
        const providers = this.mocks.map(mockMeta => {
            if (mockMeta.Mock === null) {
                mockMeta.Mock = mockMeta.forwardMock();
                if (mockMeta.doSpy) {
                    spyOnFunctionsOf(mockMeta.Mock.prototype);
                }
            }
            const newInstance = new mockMeta.Mock();
            if (mockMeta.doSpy) {
                spyOnOwnFunctionsOf(newInstance);
            }
            make(mockMeta.instance, newInstance);
            return {
                useValue: mockMeta.instance,
                provide: mockMeta.Service
            };
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
