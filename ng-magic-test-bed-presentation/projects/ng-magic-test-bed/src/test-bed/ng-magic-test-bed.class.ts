import { TestBed, ComponentFixture, TestModuleMetadata, async } from '@angular/core/testing';
import { make } from '../make/make.function';
import { spyOnFunctionsOf } from '../spy-on-mock/spy-on-functions-of.function';
import { Type, SchemaMetadata } from '@angular/core';
import { observe } from '../observe/observe.function';
import { SpyObserver } from '../observe/spy-observer.class';
import { Observable } from 'rxjs';

type AbstractType<T> = Function & { prototype: T };

export class NgMagicTestBed {

    protected preJobs: Array<(config: TestModuleMetadata) => void> = [];
    protected postJobs: Array<() => void> = [];
    private originalByReturnedInstance = new Map<any, any>();

    constructor(private initialConfig: TestModuleMetadata = {}) {
        beforeEach(async(() => this.reset()));
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
            this.originalByReturnedInstance.set(returnedInstance, newMap);
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
            this.originalByReturnedInstance.set(returnedInstance, newValue);
        });
        return returnedInstance;
    }

    public object<O extends Object>(getObject: () => O, dontSpy?: boolean): O {
        const returnedInstance: any = {};
        const targetJobs = this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(config => {
            const newValue = getObject();
            make(returnedInstance, newValue);
            if (!dontSpy) {
                spyOnFunctionsOf(returnedInstance);
            }
            this.originalByReturnedInstance.set(returnedInstance, newValue);
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
            this.originalByReturnedInstance.set(returnedInstance, newInstance);
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

        const targetJobs = typeof token === 'undefined' && this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(config => {
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
            this.originalByReturnedInstance.set(returnedInstance, mock);
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


    public imports(imports: any[]) {
        this.preJobs.push(config => {
            config.imports.push(...imports);
        });
    }

    public import(aImport: any) {
        this.imports([aImport]);
    }

    public providers(providers: any[]) {
        this.preJobs.push(config => {
            config.providers.push(...providers);
        });
    }

    public provider(provider: any) {
        this.providers([provider]);
    }

    public observer<T>(getObservable: () => Observable<T>, name?: string): SpyObserver<T> {
        const returnedInstance: any = {};
        const targetJobs = this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(() => {
            const observable = getObservable();
            const observer = observe(observable, name);
            make(returnedInstance, observer);
        });
        return returnedInstance;
    }

    public original<T>(returnedInstance: T) {
        if (!this.originalByReturnedInstance.has(returnedInstance)) {
            const errorMessage = 'NgMagicTestBed.original(): there is no original for this instance (yet).' +
                ' NgMagicTestBed.original() has to be called in it/test-block';
            throw new Error(errorMessage);
        }
        return this.originalByReturnedInstance.get(returnedInstance);
    }

    public originals<T extends Object>(returnedInstanceDictionary: T) {
        const keys = Object.keys(returnedInstanceDictionary);
        const result = {};
        keys.forEach(key => {
            const returnedInstance = returnedInstanceDictionary[key];
            result[key] = this.original(returnedInstance);
        });
        return result;
    }

    public reset() {
        this.originalByReturnedInstance.clear();
        const config: TestModuleMetadata = {
            providers: this.initialConfig.providers ? this.initialConfig.providers.slice() : [],
            declarations: this.initialConfig.declarations ? this.initialConfig.declarations.slice() : [],
            imports: this.initialConfig.imports ? this.initialConfig.imports.slice() : [],
            schemas: this.initialConfig.schemas ? this.initialConfig.schemas.slice() : [],
            aotSummaries: this.initialConfig.aotSummaries
        };
        this.preJobs.forEach(preJob => preJob(config));
        TestBed.configureTestingModule(config);
        this.postJobs.forEach(postJob => postJob());
    }
}
