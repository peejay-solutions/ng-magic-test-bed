import { TestBed, ComponentFixture, TestModuleMetadata, async } from '@angular/core/testing';
import { make } from '../make/make.function';
import { spyOnFunctionsOf } from '../spy-on-mock/spy-on-functions-of.function';
import { Type, SchemaMetadata } from '@angular/core';

declare module jasmine {
    export type Spy = any;
    export type SpyObj<T> = { [key: string]: Spy } & T;
}

type AbstractType<T> = Function & { prototype: T };

export class NgMagicTestBed {

    protected preJobs: Array<(config: TestModuleMetadata) => void> = [];
    protected postJobs: Array<() => void> = [];

    public happens() {
        beforeEach(async(() => this.reset()));
    }

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

    public objectMock<O, M extends Partial<O>>(objectClass: AbstractType<O>, getMock: () => M, dontSpy = false):
        Partial<O> & M | jasmine.SpyObj<Partial<O> & M> {
        return <Partial<O> & M | jasmine.SpyObj<Partial<O> & M>>this.mock(undefined, getMock, dontSpy, objectClass);
    }

    public providerMock<M>(token: any, getMock: () => M, dontSpy: boolean, spySource?: AbstractType<any>) {
        return this.mock(token, getMock, dontSpy, spySource);
    }

    public factoryMock(factoryClass, instances: Array<any>) {
        return this.mock(factoryClass, () => {
            let index = -1;
            return {
                create: (...args: any) => {
                    index++;
                    return args[index];
                }
            };
        });
    }

    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, getMock: () => M,
        dontSpy: true): Partial<S> & M;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, getMock: () => M):
        jasmine.SpyObj<Partial<S> & M>;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>): jasmine.SpyObj<Partial<S>>;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, getMock?: () => M, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        return this.mock(serviceClass, getMock, dontSpy, serviceClass);
    }

    private mock<S, M extends Partial<S>>(token?: any, getMock?: () => M, dontSpy?: boolean, spySource?: AbstractType<S>):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        const returnedInstance: any = {};
        this.preJobs.push(config => {
            const mock = getMock ? getMock() : {};
            make(returnedInstance, mock);
            if (!dontSpy) {
                spyOnFunctionsOf(returnedInstance, spySource.prototype);
            }
            if (typeof token !== 'undefined') {
                config.providers.push({
                    useValue: returnedInstance,
                    provide: token
                });
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

    public declarations(declarations: Array<any>) {
        this.preJobs.push(config => {
            config.declarations.push(...declarations);
        });
    }

    public declaration(declaration) {
        this.declarations([declaration]);
    }

    public schemas(schemas: Array<SchemaMetadata | any[]>) {
        this.preJobs.push(config => {
            config.schemas.push(...schemas);
        });
    }

    public schema(schema: SchemaMetadata | any[]) {
        this.schemas([schema]);
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
