import { TestBed, ComponentFixture, TestModuleMetadata } from '@angular/core/testing';
import { make } from '../make/make.function';
import { spyOnFunctionsOf } from '../spy-on-mock/spy-on-functions-of.function';
import { Type } from '@angular/core';


type AbstractType<T> = Function & { prototype: T };

export class NgMagicTestBed {

    protected preJobs: Array<(config: TestModuleMetadata) => void> = [];
    protected postJobs: Array<() => void> = [];

    public happens = this.reset.bind(this);

    public function<F extends Function>(getFunction: () => F): F {
        let innerFunction: any = () => { };
        const returnedInstance: any = (...args: any) => {
            return innerFunction(...args);
        };
        const targetJobs = this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(config => {
            innerFunction = getFunction();
        });
        return returnedInstance;
    }

    public map<M extends Map<any, any>>(getMap: () => M): M {
        const returnedInstance: any = new Map();
        const targetJobs = this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(config => {
            const newMap = getMap();
            (<Map<any, any>>returnedInstance).clear();
            newMap.forEach((element, key) => {
                (<Map<any, any>>returnedInstance).set(key, element);
            });
            Object.setPrototypeOf(returnedInstance, Object.getPrototypeOf(newMap));
        });
        return returnedInstance;
    }

    public array<A extends Array<any>>(getArray: () => A): A {
        const returnedInstance: any = [];
        const targetJobs = this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(config => {
            returnedInstance.length = 0;
            const newValue = getArray();
            returnedInstance.push(...newValue);
            Object.setPrototypeOf(returnedInstance, Object.getPrototypeOf(newValue));
        });
        return returnedInstance;
    }

    public object<M extends Object>(getObject: () => M) {
        return this.mock(getObject, true);
    }

    public fixture<C>(componentClass: Type<C>, dontCompileAfterWards: boolean = false): ComponentFixture<C> {
        const returnedInstance: any = {};
        this.preJobs.push(config => {
            config.declarations.push(componentClass);
        });
        this.postJobs.push(() => {
            const newInstance = TestBed.createComponent(componentClass);
            make(returnedInstance, newInstance);
            if (!dontCompileAfterWards) {
                TestBed.compileComponents();
            }
        });
        return returnedInstance;
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
        const returnedInstance: any = {};
        this.preJobs.push(config => {
            const Mock = forwardMockClass();
            make(returnedInstance, new Mock());
            if (!dontSpy) {
                spyOnFunctionsOf(returnedInstance);
            }
            config.providers.push({
                useValue: returnedInstance,
                provide: token
            });
        });
        return returnedInstance;
    }

    private mockObject<T extends Object>(getMock: <M extends Object>() => M & T, dontSpy?: boolean): T {
        const returnedInstance: any = {};
        const targetJobs = this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(config => {
            make(returnedInstance, getMock());
            if (!dontSpy) {
                spyOnFunctionsOf(returnedInstance);
            }
        });
        return returnedInstance;
    }

    public injection<S>(Service: AbstractType<S>): S;
    /* tslint:disable */
    public injection<S>(token: any): S;
    /* tslint:enable */
    public injection<S>(token: AbstractType<S> | any): S {
        const returnedInstance: any = {};
        this.postJobs.push(() => {
            make(returnedInstance, TestBed.get(token));
        });
        return returnedInstance;
    }

    public reset() {
        const config: TestModuleMetadata = {
            providers: [],
            declarations: [],
            imports: [],
            schemas: []
        };
        this.preJobs.forEach(preJob => preJob(config));
        TestBed.configureTestingModule(config);
        this.postJobs.forEach(postJob => postJob());
    }
}
