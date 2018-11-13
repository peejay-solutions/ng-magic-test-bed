import { TestBed } from '@angular/core/testing';
import { make } from '../make/make.function';
import { spyOnFunctionsOf } from '../spy-on-mock/spy-on-functions-of.function';
import { spyOnOwnFunctionsOf } from '../spy-on-mock/spy-on-own-functions-of.function';
import { Type } from '@angular/core';

type AbstractType<T> = Function & { prototype: T };

interface IMagicMeta {
    instance: any;
}

interface IInjectionMeta extends IMagicMeta {
    Service: Type<any>;
}

interface IServiceMockMeta extends IInjectionMeta {
    forwardMockClass: () => Type<any>;
    Mock: Type<any>;
    doSpy: boolean;
}

interface IObjectMockMeta extends IMagicMeta {
    getMock: <M extends Object>() => M;
    doSpy: boolean;
}

export class NgMagicTestBed {

    private serviceMocks: IServiceMockMeta[] = [];
    private objectMocks: IObjectMockMeta[] = [];
    private injections: IInjectionMeta[] = [];
    private addedProviders: any[] = [];

    public happen = this.reset.bind(this);

    public addProvider(provider: any) {
        this.addedProviders.push(provider);
    }

    public object<M extends Object>(getMock: () => M) {
        return this.mock(getMock, true);
    }

    public mock<M extends Object>(getMock: () => M, dontSpy?: boolean): M;
    public mock<M>(token: any, forwardMockClass: () => Type<M>, dontSpy?: boolean): M;
    public mock<M>(tokenOrGetMock: () => M | any, forwardMockOrDontSpy: boolean | (() => Type<M>), dontSpy: boolean = false): M {
        if (typeof forwardMockOrDontSpy === 'undefined' || typeof forwardMockOrDontSpy === 'boolean') {
            return this.mockObject(tokenOrGetMock, forwardMockOrDontSpy);
        }
        return this.mockService(tokenOrGetMock, forwardMockOrDontSpy, dontSpy);
    }

    private mockService<M>(token: any, forwardMockClass: () => Type<M>, dontSpy: boolean = false): M {
        const serviceMockMeta: IServiceMockMeta = {
            instance: {},
            Mock: null,
            forwardMockClass: forwardMockClass,
            Service: token,
            doSpy: !dontSpy
        };
        this.serviceMocks.push(serviceMockMeta);
        return serviceMockMeta.instance;
    }

    private mockObject<T extends Object>(getMock: <M extends Object>() => M & T, dontSpy?: boolean): T {
        const objectMockMeta: IObjectMockMeta = {
            instance: {},
            getMock: getMock,
            doSpy: !dontSpy
        };
        this.objectMocks.push(objectMockMeta);
        return objectMockMeta.instance;
    }

    public injection<S>(Service: AbstractType<S>): S;
    /* tslint:disable */
    public injection<S>(token: any): S;
    /* tslint:enable */
    public injection<S>(Service: AbstractType<S> | any): S {
        const injectionMeta: IInjectionMeta = {
            instance: {},
            Service: Service
        };
        this.injections.push(injectionMeta);
        return injectionMeta.instance;
    }

    public reset() {
        const mockProviders = this.serviceMocks.map(serviceMockMeta => {
            if (serviceMockMeta.Mock === null) {
                serviceMockMeta.Mock = serviceMockMeta.forwardMockClass();
            }
            const newInstance = new serviceMockMeta.Mock();
            if (serviceMockMeta.doSpy) {
                spyOnFunctionsOf(serviceMockMeta.Mock.prototype);
                spyOnOwnFunctionsOf(newInstance);
            }
            make(serviceMockMeta.instance, newInstance);
            return {
                useValue: serviceMockMeta.instance,
                provide: serviceMockMeta.Service
            };
        });
        const providers = this.addedProviders.concat(mockProviders);
        TestBed.configureTestingModule({
            providers: providers
        });
        this.injections.forEach(injectionMeta => {
            const newInstance = TestBed.get(injectionMeta.Service);
            make(injectionMeta.instance, newInstance);
        });
        this.objectMocks.forEach(objectMockMeta => {
            const newInstance = objectMockMeta.getMock();
            if (objectMockMeta.doSpy) {
                spyOnFunctionsOf(newInstance);
            }
            make(objectMockMeta.instance, newInstance);
        });
    }
}
