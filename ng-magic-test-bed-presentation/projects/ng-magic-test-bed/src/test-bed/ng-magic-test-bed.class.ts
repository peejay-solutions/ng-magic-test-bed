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

    public object<O extends Object>(getObject: () => O, dontSpy?: boolean): O {
        const returnedInstance: any = {};
        const targetJobs = this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(config => {
            make(returnedInstance, getObject());
            if (!dontSpy) {
                spyOnFunctionsOf(returnedInstance);
            }
        });
        return returnedInstance;
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

    public providerMock<M>(token: any, forwardMockClass: () => Type<M>, dontSpy: true) {
        return this.mock(token, forwardMockClass, dontSpy);
    }

    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, forwardMockClass: () => Type<M>,
        dontSpy: true): Partial<S> & M;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, forwardMockClass: () => Type<M>):
        jasmine.SpyObj<Partial<S> & M>;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>): jasmine.SpyObj<Partial<S>>;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, forwardMockClass?: () => Type<M>, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {

        return this.mock(serviceClass, forwardMockClass, dontSpy, serviceClass);
    }


    private mock<S, M extends Partial<S>>(token: any, forwardMockClass?: () => Type<M>, dontSpy?: boolean, spySource?: AbstractType<S>):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        const returnedInstance: any = {};
        this.preJobs.push(config => {
            const mock = forwardMockClass ? new (forwardMockClass())() : {};
            make(returnedInstance, mock);
            if (!dontSpy) {
                spyOnFunctionsOf(returnedInstance, spySource.prototype);
            }
            config.providers.push({
                useValue: returnedInstance,
                provide: token
            });
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
