import { TestBed, TestModuleMetadata, ComponentFixture, MetadataOverride, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { SchemaMetadata, Type, AbstractType, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { spyOnFunctionsOf } from '../spy-on-functions/spy-on-functions-of.function';
import { Observable } from 'rxjs';
import { observe } from '../observe/observe.function';
import { SpyObserver } from '../observe/spy-observer.class';
import { By } from '@angular/platform-browser';


export type IFactory<F> = {
    create(...args: Array<any>): any;
} & Partial<F>;

export class NgMagicSetupTestBed {

    private config: TestModuleMetadata;
    private configured = false;
    private compiled = false;
    private postConfigureJobs: Array<() => void> = [];
    private fixtureJobs: Array<() => void> = [];
    private fixtureInstance: ComponentFixture<any> = null;

    /**
    * @param initialConfig  initial config which will be extended by the other method of the
    * constructed instance. The final config will be used to call TestBed.configureTestingModule implicitly by
    * calling e.g. .injection()
    */
    constructor(initialConfig: TestModuleMetadata = {}) {
        this.config = {
            providers: initialConfig.providers ? initialConfig.providers.slice() : [],
            declarations: initialConfig.declarations ? initialConfig.declarations.slice() : [],
            imports: initialConfig.imports ? initialConfig.imports.slice() : [],
            schemas: initialConfig.schemas ? initialConfig.schemas.slice() : [],
            aotSummaries: initialConfig.aotSummaries
        };
    }

    private configureTestingModule() {
        if (this.configured) {
            return;
        }
        this.configured = true;
        TestBed.configureTestingModule(this.config);
        this.postConfigureJobs.forEach(job => job());
        this.postConfigureJobs.length = 0;
    }

    private expectToBePreConfiguration() {
        if (this.configured) {
            throw new Error('The TestBed has been implicitly configured by calling e.g.' +
                '"injection" or "fixture" the method you called needs a not configured TestBed to be executed');
        }
    }

    /**
    * @param declarations initial config which will be extended by the other method of the
    * constructed instance. The final config will be used to call TestBed.configureTestingModule implicitly by
    * calling e.g. .injection()
    */
    public declarations(declarations: Array<any>) {
        this.expectToBePreConfiguration();
        this.config.declarations.push(...declarations);
    }

    public declaration(declaration) {
        this.declarations([declaration]);
    }

    public schemas(schemas: Array<SchemaMetadata | any[]>) {
        this.expectToBePreConfiguration();
        this.config.schemas.push(...schemas);
    }

    public schema(schema: SchemaMetadata | any[]) {
        this.schemas([schema]);
    }

    public imports(imports: any[]) {
        this.expectToBePreConfiguration();
        this.config.imports.push(...imports);
    }

    public import(aImport: any) {
        this.imports([aImport]);
    }

    public providers(providers: any[]) {
        this.expectToBePreConfiguration();
        this.config.providers.push(...providers);
    }

    public provider(provider: any) {
        this.providers([provider]);
    }

    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>, mock: M,
        dontSpy: true): Partial<S> & M;
    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>, mock: M):
        jasmine.SpyObj<Partial<S> & M>;
    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>):
        jasmine.SpyObj<Partial<S>>;
    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>,
        mock?: M, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        return this.componentProviderMock(pipeClass, serviceClass, mock, dontSpy, serviceClass);
    }

    public pipeProviderMock<M>(pipeClass: Type<any>, token: any, mock: M, dontSpy = false,
        spySource?: AbstractType<any>): M {
        return this.uiThingProviderMock('overridePipe', pipeClass, token, mock, dontSpy, spySource);
    }

    public directiveServiceMock<S, M extends Partial<S>>(directiveClass: Type<any>, serviceClass: AbstractType<S>, mock: M,
        dontSpy: true): Partial<S> & M;
    public directiveServiceMock<S, M extends Partial<S>>(directiveClass: Type<any>, serviceClass: AbstractType<S>, mock: M):
        jasmine.SpyObj<Partial<S> & M>;
    public directiveServiceMock<S, M extends Partial<S>>(directiveClass: Type<any>, serviceClass: AbstractType<S>):
        jasmine.SpyObj<Partial<S>>;
    public directiveServiceMock<S, M extends Partial<S>>(directiveClass: Type<any>, serviceClass: AbstractType<S>,
        mock?: M, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        return this.componentProviderMock(directiveClass, serviceClass, mock, dontSpy, serviceClass);
    }

    public directiveProviderMock<M>(directiveClass: Type<any>, token: any, mock: M, dontSpy = false,
        spySource?: AbstractType<any>): M {
        return this.uiThingProviderMock('overrideDirective', directiveClass, token, mock, dontSpy, spySource);
    }

    public componentServiceMock<S, M extends Partial<S>>(componentClass: Type<any>, serviceClass: AbstractType<S>, mock: M,
        dontSpy: true): Partial<S> & M;
    public componentServiceMock<S, M extends Partial<S>>(componentClass: Type<any>, serviceClass: AbstractType<S>, mock: M):
        jasmine.SpyObj<Partial<S> & M>;
    public componentServiceMock<S, M extends Partial<S>>(componentClass: Type<any>, serviceClass: AbstractType<S>):
        jasmine.SpyObj<Partial<S>>;
    public componentServiceMock<S, M extends Partial<S>>(componentClass: Type<any>, serviceClass: AbstractType<S>,
        mock?: M, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        return this.componentProviderMock(componentClass, serviceClass, mock, dontSpy, serviceClass);
    }

    public componentProviderMock<M>(componentClass: Type<any>, token: any, mock: M, dontSpy = false,
        spySource?: AbstractType<any>): M {
        return this.uiThingProviderMock('overrideComponent', componentClass, token, mock, dontSpy, spySource);
    }

    private uiThingProviderMock<M>(methodName: string, uiThingClass: Type<any>, token: any, mock: M, dontSpy = false,
        spySource?: AbstractType<any>): M {
        this.expectToBePreConfiguration();
        if (!dontSpy) {
            spyOnFunctionsOf(mock, spySource ? spySource.prototype : undefined);
        }
        if (!this.config.declarations.includes(uiThingClass)) {
            this.config.declarations.push(uiThingClass);
        }
        this.postConfigureJobs.push(() => {
            TestBed[methodName](uiThingClass, {
                add: {
                    providers: [
                        { provide: token, useValue: mock }
                    ]
                }
            });
        });
        return mock;
    }

    public directiveMocks<C>(directiveClass: Type<C>): Array<C> {
        return this.componentMocks(directiveClass);
    }

    /**
    * @param componentClass class of the component that should be used in the fixture for a specific selector you want to mock.
    * @returns an arry of all component instance that were found statically inside the fixture. The array's members can only be
    * used after calling .fixture(). Before that time the array is initialized with an error string as its only member.
    */
    public componentMocks<C>(componentClass: Type<C>): Array<C> {
        const result: Array<any> = ['this array can only be used after fixture called'];
        this.expectToBePreConfiguration();
        if (!this.config.declarations.includes(componentClass)) {
            this.config.declarations.push(componentClass);
        }
        this.fixtureJobs.push(() => {
            result.length = 0;
            const componentDebugElements = this.fixtureInstance.debugElement.queryAll(By.directive(componentClass));
            componentDebugElements.forEach(componentDebugElement => result.push(componentDebugElement.injector.get(componentClass)));
        });
        return result;
    }

    /**
    * This method may only be called once per NgMagicTestBed instance.
    * @param componentClass class of the root component you want to compile and create.
    * @param disableNoErrorSchema by default the NgMagicTestBed uses the NO_ERROR_SCHEMA of angular to prevent the compiler from
    * throwing exceptions e.g. for missing or unknown inputs.
    * @returns a component fixture like standard TestBed.createComponent(componentClass) would have returned it.
    */
    public fixture<C>(componentClass: Type<C>, initialInputs: Partial<C> = {}, disableNoErrorSchema = false): ComponentFixture<C> {
        if (this.fixtureInstance) {
            throw new Error('.fixture can only be called once per NgMagicTestBed instance');
        }
        if (!this.config.declarations.includes(componentClass) && this.configured) {
            throw new Error('Declaration of component needs to be done before you can create the fixture');
        }
        if (!this.config.declarations.includes(componentClass) && !this.configured) {
            this.config.declarations.push(componentClass);
        }
        if (!disableNoErrorSchema && !this.config.schemas.includes(NO_ERRORS_SCHEMA)) {
            this.config.schemas.push(NO_ERRORS_SCHEMA);
        }
        if (!this.config.providers.find(entry => entry.provide === ComponentFixtureAutoDetect)) {
            this.config.providers.push({ provide: ComponentFixtureAutoDetect, useValue: true });
        }
        if (!this.configured) {
            this.configureTestingModule();
        }
        if (!this.compiled) {
            this.compiled = true;
            TestBed.compileComponents();
        }
        this.fixtureInstance = TestBed.createComponent(componentClass);
        Object.assign(this.fixtureInstance.componentInstance, initialInputs);
        this.fixtureInstance.detectChanges();
        this.fixtureJobs.forEach(job => job());
        return this.fixtureInstance;
    }

    public objectMock<O, M extends Partial<O>>(objectClass: AbstractType<O> | undefined, mock: M | any, dontSpy = false):
        Partial<O> & M | jasmine.SpyObj<Partial<O> & M> {
        return <Partial<O> & M | jasmine.SpyObj<Partial<O> & M>>this.mock(undefined, mock, dontSpy, objectClass);
    }

    public providerMock<M>(token: any, mock: M, dontSpy: boolean, spySource?: AbstractType<any>) {
        return this.mock(token, mock, dontSpy, spySource);
    }

    public factoryMock<F>(factoryClass: Type<F>, instances: Array<any>): jasmine.SpyObj<Partial<F>> {
        let index = -1;
        return <any>this.mock(factoryClass, {
            create: (...args: any) => {
                index++;
                return instances[index];
            },
        }, false, factoryClass);
    }

    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, mock: M,
        dontSpy: true): Partial<S> & M;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, mock: M):
        jasmine.SpyObj<Partial<S> & M>;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>): jasmine.SpyObj<Partial<S>>;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, mock?: M, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        return this.mock(serviceClass, mock, dontSpy, serviceClass);
    }

    private mock<S, M extends Partial<S>>(token?: any, mock: M = <any>{}, dontSpy?: boolean, spySource?: AbstractType<S>):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        this.expectToBePreConfiguration();
        if (!dontSpy) {
            spyOnFunctionsOf(mock, spySource ? spySource.prototype : undefined);
        }
        this.config.providers.push({
            useValue: mock,
            provide: token
        });
        return mock;
    }

    public injection<S>(Service: AbstractType<S>): S;
    /* tslint:disable */
    public injection<S>(token: any): S;
    /* tslint:enable */
    public injection<S>(token: AbstractType<S> | any): S {
        this.configureTestingModule();
        return TestBed.get(token);
    }

    public observer<T>(observable: Observable<T>, name?: string): SpyObserver<T> {
        return observe(observable, name);
    }


}
