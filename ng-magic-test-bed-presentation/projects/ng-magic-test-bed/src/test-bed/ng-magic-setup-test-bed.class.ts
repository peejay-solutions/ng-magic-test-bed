import { TestBed, TestModuleMetadata, ComponentFixture, MetadataOverride, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { SchemaMetadata, Type, AbstractType, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { spyOnFunctionsOf } from '../spy-on-functions/spy-on-functions-of.function';
import { Observable } from 'rxjs';
import { observe } from '../observe/observe.function';
import { SpyObserver } from '../observe/spy-observer.class';
import { By } from '@angular/platform-browser';


export interface IFactory<I> {
    create(...args: Array<any>): I;
}

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
    * @param declarations declarations will be pushed to the declarations of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public declarations(declarations: Array<any>) {
        this.expectToBePreConfiguration();
        this.config.declarations.push(...declarations);
    }

    /**
    * @param declaration declaration will be pushed to the declarations of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public declaration(declaration) {
        this.declarations([declaration]);
    }

    /**
    * @param schemas schemas will be pushed to the schemas of the testing module config. Note that the NO_ERRORS_SCHEMA
    * is pushed by default. This can be disabled when calling .fixture().
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public schemas(schemas: Array<SchemaMetadata | any[]>) {
        this.expectToBePreConfiguration();
        this.config.schemas.push(...schemas);
    }

    /**
    * @param schema schema will be pushed to the schemas of the testing module config. Note that the NO_ERRORS_SCHEMA
    * is pushed by default. This can be disabled when calling .fixture().
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public schema(schema: SchemaMetadata | any[]) {
        this.schemas([schema]);
    }

    /**
    * @param imports imports will be pushed to the imports of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public imports(imports: any[]) {
        this.expectToBePreConfiguration();
        this.config.imports.push(...imports);
    }

    /**
    * @param imports import will be pushed to the imports of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public import(aImport: any) {
        this.imports([aImport]);
    }

    /**
    * @param providers providers will be pushed to the providers of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public providers(providers: any[]) {
        this.expectToBePreConfiguration();
        this.config.providers.push(...providers);
    }

    /**
    * @param provider import will be pushed to the providers of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public provider(provider: any) {
        this.providers([provider]);
    }

    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>, mock: M,
        dontSpy: true): Partial<S> & M;
    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>, mock: M):
        jasmine.SpyObj<Partial<S> & M>;
    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>):
        jasmine.SpyObj<Partial<S>>;
    /**
    * @description If you have pipe that provides a service you can mock it using this method.
    * @param pipeClass the pipeClass is the reference of the class of your angular pipe.
    * @param serviceClass the serviceClass is the reference to the class of the service that you want to mock
    * @param mock the mock mocks the service and should implement a partial of the service class
    * @param dontSpy optional parameter to prevent the default spy creation on the mock using the prototype of the serviceClass
    */
    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>,
        mock?: M, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        return this.componentProviderMock(pipeClass, serviceClass, mock, dontSpy, serviceClass);
    }

   /**
    * @description If you have pipe that provides a provider you can mock it using this method.
    * @param pipeClass the pipeClass is the reference of the class of your angular pipe.
    * @param token the provider token that you want to mock
    * @param mock the mock
    * @param dontSpy optional parameter to prevent the default spy creation on the mock
    */
    public pipeProviderMock<M>(pipeClass: Type<any>, token: any, mock: M, dontSpy = false,
        spySource?: AbstractType<any>): M {
        return this.uiThingProviderMock('overridePipe', pipeClass, token, mock, dontSpy, spySource);
    }

    /**
    * @description If you have directive that provides a service you can mock it using this method.
    * @param directiveClass the directiveClass is the reference of the class of your angular directive.
    * @param serviceClass the serviceClass is the reference to the class of the service that you want to mock
    * @param mock the mock mocks the service and should implement a partial of the service class
    * @param dontSpy optional parameter to prevent the default spy creation on the mock using the prototype of the serviceClass
    */
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

    /**
    * @description If you have directive that provides a provider you can mock it using this method.
    * @param directiveClass the directiveClass is the reference of the class of your angular directive.
    * @param token the provider token that you want to mock
    * @param mock the mock
    * @param dontSpy optional parameter to prevent the default spy creation on the mock
    */
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
    /**
    * @description If you have component that provides a service you can mock it using this method.
    * @param componentClass the componentClass is the reference of the class of your angular component.
    * @param serviceClass the serviceClass is the reference to the class of the service that you want to mock
    * @param mock the mock mocks the service and should implement a partial of the service class
    * @param dontSpy optional parameter to prevent the default spy creation on the mock using the prototype of the serviceClass
    */
    public componentServiceMock<S, M extends Partial<S>>(componentClass: Type<any>, serviceClass: AbstractType<S>,
        mock?: M, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        return this.componentProviderMock(componentClass, serviceClass, mock, dontSpy, serviceClass);
    }

    /**
    * @description If you have component provides a provider you can mock it using this method.
    * @param componentClass the componentClass is the reference of the class of your angular component.
    * @param token the provider token that you want to mock
    * @param mock the mock
    * @param dontSpy optional parameter to prevent the default spy creation on the mock
    */
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
    * @description declare that you want to mock for a selector and retrieve all created component mock instances after fixture
    * creation.
    * @param componentClass class of the component that should be used in the fixture for a specific selector you want to mock.
    * @returns an arry of all component instances that were found statically inside the fixture. The array's members can only be
    * used after calling .fixture(). Before that time the array is initialized like this:
    * ['this array can only be used after fixture called'].
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
    * @description Use this method to create a component fixture. This method may only be called once per NgMagicTestBed instance.
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

    /**
     * @description Creates a mock where all spies are created automatically.
     * This method does not register anything at the TestBed or its configuration.
     * @param objectClass This class' prototype will be used to create simple jasmine spies on all methods this class has
     * @param mock An object that should implement partial of objectClass and contain all methods that you want to return something.
     * @param dontSpy optional parameter to prevent the default spy creation on the mock.
     * @returns Your mocks methods will be overwritten with spies that call through to the mocks methods like jasmine's spyOn method.
     * In addition to that a spy will be added for each additional method that was found on the objectClass' prototype.
     */
    public objectMock<O, M extends Partial<O>>(objectClass: AbstractType<O> | undefined, mock: M | any, dontSpy = false):
        Partial<O> & M | jasmine.SpyObj<Partial<O> & M> {
        return <Partial<O> & M | jasmine.SpyObj<Partial<O> & M>>this.mock(undefined, mock, dontSpy, objectClass);
    }

    /**
     * @description mocks a provider for a given token with a given mock. If wanted your mock can be extended by spies
     * from a given spySource class.
     * @param token token for provider provision
     * @param mock mock that will be registered for the token
     * @param dontSpy optional parameter to prevent the default spy creation on the mock.
     * @param spySource for each method in spySources prototype an additional jasmine spy will be created on the mock
     * @returns Your mocks methods will be overwritten with spies that call through to the mocks methods like jasmine's spyOn method.
     * In addition to that a spy will be added for each additional method that was found on the objectClass' prototype.
     */
    public providerMock<M>(token: any, mock: M, dontSpy: boolean = false, spySource?: AbstractType<any>) {
        return this.mock(token, mock, dontSpy, spySource);
    }

      /**
     * @description mocks a service that has a "create" method.
     * @param factoryClass service that has a "create" method that you want to mock.
     * @param instances will be returned by the mock this method return when "create" is called.
     * The first call of mock.create() will return the first item in the instances-array and so on.
     * @returns a mock for the factory. mock.create will return the one of the given instances every time it is called
     */
    public factoryMock<I, F extends IFactory<I>>(factoryClass: AbstractType<F>, instances: Array<I>): jasmine.SpyObj<Partial<F>> {
        let index = -1;
        return <any>this.mock(factoryClass, <any>{
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

    /**
     * @description mocks a service with the given mock
     * @param serviceClass service that you want to mock
     * @param mock that should mock the service. All methods on the mock will become spies. For each method on serviceClass'
     * prototype another spy will be added to the mock.
     * @param dontSpy optional parameter to prevent the default spy creation on the mock.
     * @returns the mock after creating some spies on it (if not disabled)
     */
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, mock?: M, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        return this.mock(serviceClass, mock, dontSpy, serviceClass);
    }

    private mock<S, M extends Partial<S>>(token?: any, mock: M = <any>{}, dontSpy?: boolean, spySource?: AbstractType<S>):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        if (!dontSpy) {
            spyOnFunctionsOf(mock, spySource ? spySource.prototype : undefined);
        }
        if (token) {
            this.expectToBePreConfiguration();
            this.config.providers.push({
                useValue: mock,
                provide: token
            });
        }
        return mock;
    }

    public injection<S>(service: AbstractType<S>): S;
    /* tslint:disable */
    public injection<S>(token: any): S;
    /* tslint:enable */
    /**
     * @description return you the service or provider for a given token from the angular dependency injection.
     * This will trigger the TestBed configureTestingModule step. After this step you can not create any more mocks.
     * Make sure you create all your mocks before calling this mehtod.
     * @param serviceClass service that you want to inject
     * @param token of the prider that you want to inject
     * @return whatever angular dependency injection finds for your token
     */
    public injection<S>(token: AbstractType<S> | any): S {
        this.configureTestingModule();
        return TestBed.get(token);
    }

    /**
    * @description
    * Subscribes to a given observable and spies on its states and emitted values.
    * @param observable
    * Observable you want to spy
    * @param name
    * Optional name that prefixes all jasmine spies that are created by the observer. This makes it easier to read the
    * test output if anything fails.
    * @returns
    * observer that can be used to make assertions in your test cases e.g.:
    * expect(observer.next).toHaveBeenCalledWith(expectedValue);
    * For more information check SpyObserver documentation
    */
    public observer<T>(observable: Observable<T>, name?: string): SpyObserver<T> {
        return observe(observable, name);
    }


}
