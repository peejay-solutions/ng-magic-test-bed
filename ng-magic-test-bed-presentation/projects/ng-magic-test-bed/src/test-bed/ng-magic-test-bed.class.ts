import { TestBed, TestModuleMetadata, ComponentFixture } from '@angular/core/testing';
import { SchemaMetadata, Type, AbstractType } from '@angular/core';
import { SpyObj } from '../spy-framework/spy-framework';
import { Observable } from 'rxjs';
import { observe } from '../observe/observe.function';
import { SpyObserver } from '../observe/spy-observer.class';
import { TestBedConfigurator } from './test-bed-configurator.class';
import { IFactory } from './i-factory.interface';

export class NgMagicTestBed {

    /**
    * @ignore
    */
    private configurator: TestBedConfigurator;

    /**
    * @param initialConfig  initial config which will be extended by the other methods of this NgMagicSetupTestBed instance.
    *  The final config will be used to call TestBed.configureTestingModule implicitly by
    * calling e.g. .injection()
    */
    constructor(initialConfig: TestModuleMetadata = {}) {
        this.configurator = new TestBedConfigurator(initialConfig);
    }

    /**
    * @param declarations declarations will be pushed to the declarations of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public declarations(declarations: Array<any>) {
        this.configurator.declarations(declarations);
    }

    /**
    * @param declaration declaration will be pushed to the declarations of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public declaration(declaration: any) {
          this.configurator.declarations([declaration]);
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
           this.configurator.schemas(schemas);
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
          this.configurator.schemas([schema]);
    }

    /**
    * @param imports imports will be pushed to the imports of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public imports(imports: any[]) {
        this.configurator.imports(imports);
    }

    /**
    * @param imports import will be pushed to the imports of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public import(aImport: any) {
           this.configurator.imports([aImport]);
    }

    /**
    * @param providers providers will be pushed to the providers of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public providers(providers: any[]) {
        this.configurator.providers(providers);
    }

    /**
    * @param provider import will be pushed to the providers of the testing module config.
    * check out angular docs for more information
    * https://angular.io/guide/testing-services#angular-testbed
    * https://angular.io/api/core/testing/TestBed#configuretestingmodule
    * https://angular.io/api/core/testing/TestModuleMetadata
    */
    public provider(provider: any) {
         this.configurator.providers([provider]);
    }

    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>, mock: M,
        dontSpy: true): S & M;
    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>, mock: M):
        SpyObj<S> & M;
    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>):
        SpyObj<S>;
    /**
    *  If you have pipe that provides a service you can mock it using this method.
    * @param pipeClass the pipeClass is the reference of the class of your angular pipe.
    * @param serviceClass the serviceClass is the reference to the class of the service that you want to mock
    * @param mock the mock mocks the service and should implement a partial of the service class
    * @param dontSpy optional parameter to prevent the default spy creation on the mock using the prototype of the serviceClass
    */
    public pipeServiceMock<S, M extends Partial<S>>(pipeClass: Type<any>, serviceClass: AbstractType<S>,
        mock?: M, dontSpy?: boolean):
        SpyObj<S> & M | S & M | SpyObj<S> | S  {
        return <any> this.componentProviderMock(pipeClass, serviceClass, mock, dontSpy, serviceClass);
    }

    /**
     *  If you have pipe that provides a provider you can mock it using this method.
     * @param pipeClass the pipeClass is the reference of the class of your angular pipe.
     * @param token the provider token that you want to mock
     * @param mock the mock
     * @param dontSpy optional parameter to prevent the default spy creation on the mock
     */
    public pipeProviderMock<M>(pipeClass: Type<any>, token: any, mock: M, dontSpy = false,
        spySource?: AbstractType<any>): M {
        return this.configurator.uiThingProviderMock('overridePipe', pipeClass, token, mock, dontSpy, spySource);
    }

    /**
    * If you have directive that provides a service you can mock it using this method.
    * @param directiveClass the directiveClass is the reference of the class of your angular directive.
    * @param serviceClass the serviceClass is the reference to the class of the service that you want to mock
    * @param mock the mock mocks the service and should implement a partial of the service class
    * @param dontSpy optional parameter to prevent the default spy creation on the mock using the prototype of the serviceClass
    */
    public directiveServiceMock<S, M extends Partial<S>>(directiveClass: Type<any>, serviceClass: AbstractType<S>, mock: M,
        dontSpy: true): S & M;
    public directiveServiceMock<S, M extends Partial<S>>(directiveClass: Type<any>, serviceClass: AbstractType<S>, mock: M):
        SpyObj<S> & M;
    public directiveServiceMock<S, M extends Partial<S>>(directiveClass: Type<any>, serviceClass: AbstractType<S>):
        SpyObj<S>;
    public directiveServiceMock<S, M extends Partial<S>>(directiveClass: Type<any>, serviceClass: AbstractType<S>,
        mock?: M, dontSpy?: boolean):
        S & M | SpyObj<S> & M | SpyObj<S> {
        return <any> this.componentProviderMock(directiveClass, serviceClass, mock, dontSpy, serviceClass);
    }

    /**
    *  If you have directive that provides a provider you can mock it using this method.
    * @param directiveClass the directiveClass is the reference of the class of your angular directive.
    * @param token the provider token that you want to mock
    * @param mock the mock
    * @param dontSpy optional parameter to prevent the default spy creation on the mock
    */
    public directiveProviderMock<M>(directiveClass: Type<any>, token: any, mock: M, dontSpy = false,
        spySource?: AbstractType<any>): M {
        return this.configurator.uiThingProviderMock('overrideDirective', directiveClass, token, mock, dontSpy, spySource);
    }


    public componentServiceMock<S, M extends Partial<S>>(componentClass: Type<any>, serviceClass: AbstractType<S>, mock: M,
        dontSpy: true): S & M;
    public componentServiceMock<S, M extends Partial<S>>(componentClass: Type<any>, serviceClass: AbstractType<S>, mock: M):
        SpyObj<S> & M;
    public componentServiceMock<S, M extends Partial<S>>(componentClass: Type<any>, serviceClass: AbstractType<S>):
        SpyObj<S>;
    /**
    *  If you have component that provides a service you can mock it using this method.
    * @param componentClass the componentClass is the reference of the class of your angular component.
    * @param serviceClass the serviceClass is the reference to the class of the service that you want to mock
    * @param mock the mock mocks the service and should implement a partial of the service class
    * @param dontSpy optional parameter to prevent the default spy creation on the mock using the prototype of the serviceClass
    */
    public componentServiceMock<S, M extends Partial<S>>(componentClass: Type<any>, serviceClass: AbstractType<S>,
        mock?: M, dontSpy?: boolean):
        S & M | SpyObj<S> & M | SpyObj<S> {
        return <any>this.componentProviderMock(componentClass, serviceClass, mock, dontSpy, serviceClass);
    }

    /**
    *  If you have component provides a provider you can mock it using this method.
    * @param componentClass the componentClass is the reference of the class of your angular component.
    * @param token the provider token that you want to mock
    * @param mock the mock
    * @param dontSpy optional parameter to prevent the default spy creation on the mock
    */
    public componentProviderMock<M>(componentClass: Type<any>, token: any, mock: M, dontSpy = false,
        spySource?: AbstractType<any>): M {
        return this.configurator.uiThingProviderMock('overrideComponent', componentClass, token, mock, dontSpy, spySource);
    }


    /**
    *  declare that you want to mock a directive for a selector and retrieve all created component mock instances after fixture
    * creation.
    * @param directiveClass class of the directive that should be used in the fixture for a specific selector you want to mock.
    * @returns an array of all component instances that were found statically inside the fixture. The array's members can only be
    * used after calling .fixture(). Before that time the array is initialized like this:
    * ['this array can only be used after fixture() was called'].
    */
    public directiveMocks<C>(directiveClass: Type<C>): Array<C> {
        return this.configurator.componentMocks(directiveClass);
    }

    /**
     * declare that you want to mock a pipe for a selector.
     * @param pipeClass class of the pipe that should be used in the fixture for a specific pipe selector that you want to mock.
     */
    public pipeMock<C>(pipeClass: Type<C>){
        //TODO: maybe there is some more we can do to pipes to make it easier to mock or spy them
        this.configurator.addToImportsOrDeclarations(pipeClass);
    }

    /**
     * declare that you want to keep a pipe for a selector.
     * @param pipeClass class of the pipe that you want to keep to use it in your fixture.
     */
    public keptPipe<C>(pipeClass: Type<C>){
        this.pipeMock(pipeClass);
    }

 //TODO Documentation
    public keptDirectives<C>(directiveClass: Type<C>): Array<C> {
        return this.directiveMocks(directiveClass);
    }

 //TODO Documentation
    public keptComponents<C>(componentClass: Type<C>): Array<C> {
        return this.configurator.keptComponents(componentClass);
    }

    /**
    *  declare that you want to mock a component for a selector and retrieve all created component mock instances after fixture
    * creation.
    * @param componentClass class of the component that should be used in the fixture for a specific selector you want to mock.
    * @returns an array of all component instances that were found statically inside the fixture. The array's members can only be
    * used after calling .fixture(). Before that time the array is initialized like this:
    * ['this array can only be used after fixture() was called'].
    */
    public componentMocks<C>(componentClass: Type<C>): Array<C> {
        return this.configurator.componentMocks(componentClass);
    }

    /**
    *  Use this method to create a component fixture. This method may only be called once per NgMagicTestBed instance.
    * @param componentClass class of the root component you want to compile and create.
    * @param disableNoErrorSchema by default the NgMagicTestBed uses the NO_ERROR_SCHEMA of angular to prevent the compiler from
    * throwing exceptions e.g. for missing or unknown inputs.
    * @returns a component fixture like standard TestBed.createComponent(componentClass) would have returned it.
    */
    public fixture<C>(componentClass: Type<C>, initialInputs: Partial<C> = {}, disableNoErrorSchema = false): ComponentFixture<C> {
        return this.configurator.fixture(componentClass, initialInputs);
    }

    /**
     * Can be used to create a mock for an object that should not be registered at angular TestBed.
     * @param objectClass This class' prototype will be used to extend the result mock by a spy for each method on the prototype.
     * @param mock An object that should implement partial of objectClass and contain all methods that you want to return something.
     * @param dontSpy optional parameter to prevent the default spy creation on the mock.
     * @returns Your mocks methods will be overwritten with spies that call through to the mocks methods like spyOn method of your test framework.
     * In addition to that a spy will be added for each additional method that was found on the objectClass' prototype.
     */
    public objectMock<O, M extends Partial<O>>(objectClass: AbstractType<O>, mock: M,
        dontSpy: true): O & M;
    public objectMock<O, M extends Partial<O>>(objectClass: AbstractType<O>, mock: M):
        SpyObj<O> & M & O;
    public objectMock<O, M extends Partial<O>>(objectClass: undefined, mock: M): SpyObj<M>;

    public objectMock<O, M extends Partial<O>>(objectClass: AbstractType<O> | undefined, mock: M | any, dontSpy = false):
        O & M | SpyObj<O> & M {
        return <O & M | SpyObj<O> & M>this.configurator.mock(undefined, mock, dontSpy, objectClass);
    }

    /**
     *  mocks a provider for a given token with a given mock. If wanted your mock can be extended by spies
     * from a given spySource class.
     * @param token token for provider provision
     * @param mock mock that will be registered for the token
     * @param dontSpy optional parameter to prevent the default spy creation on the mock.
     * @param spySource for each method in spySources prototype an additional spy will be created on the mock
     * @returns Your mocks methods will be overwritten with spies that call through to the mocks methods like spyOn method of your test framework.
     * In addition to that a spy will be added for each additional method that was found on the objectClass' prototype.
     */
    public providerMock<M>(token: any, mock: Partial<M>, dontSpy: boolean = false, spySource?: AbstractType<any>) {
        return this.configurator.mock(token, mock, dontSpy, spySource);
    }

    /**
   *  mocks a service that has a "create" method.
   * @param factoryClass service that has a "create" method that you want to mock.
   * @param instances will be returned by the mock this method return when "create" is called.
   * The first call of mock.create() will return the first item in the instances-array and so on.
   * @returns a mock for the factory. mock.create will return the one of the given instances every time it is called
   */
    public factoryMock<I, F extends IFactory<I>, M>(factoryClass: AbstractType<F>, instances: Array<M & I>): SpyObj<Partial<F>> {
        let index = -1;
        return <any>this.configurator.mock(factoryClass, <any>{
            create: (...args: any) => {
                index++;
                return instances[index];
            },
        }, false, factoryClass);
    }

    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, mock: M,
        dontSpy: true): S & M;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, mock: M):
        SpyObj<S> & M;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>): SpyObj<S>;

    /**
     *  mocks a service with the given mock
     * @param serviceClass service that you want to mock
     * @param mock that should mock the service. All methods on the mock will become spies. For each method on serviceClass'
     * prototype another spy will be added to the mock.
     * @param dontSpy optional parameter to prevent the default spy creation on the mock.
     * @returns the mock after creating some spies on it (if not disabled)
     */
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, mock?: M, dontSpy?: boolean):
        S & M | SpyObj<S> & M | SpyObj<S> {
        return this.configurator.mock(serviceClass, mock, dontSpy, serviceClass);
    }


    public injection<S>(service: AbstractType<S>): S;
    /* tslint:disable */
    public injection<S>(token: any): S;
    /* tslint:enable */
    /**
     *  return you the service or provider for a given token from the angular dependency injection.
     * This will trigger the TestBed configureTestingModule step. After this step you can not create any more mocks.
     * Make sure you create all your mocks before calling this method.
     * @param serviceClass service that you want to inject
     * @param token of the provider that you want to inject
     * @return whatever angular dependency injection finds for your token
     */
    public injection<S>(token: AbstractType<S> | any): S {
        this.configurator.configureTestingModule();
        return TestBed.inject(token);
    }

    /**
    *
    * Subscribes to a given observable and spies on its states and emitted values.
    * @param observable
    * Observable you want to spy
    * @param name
    * Optional name that prefixes all spies that are created by the observer. This makes it easier to read the
    * test output if anything fails.
    * @returns
    * observer that can be used to make assertions in your test cases e.g.:
    * expect(observer.next).toHaveBeenCalledWith(expectedValue);
    * For more information check SpyObserver documentation
    */
    public observer<T>(observable: Observable<T>, name?: string): SpyObserver<T> {
        return observe(observable, name);
    }

  
    /**
     *  
     * Can be used to run a callback in injection context. Like TestBed.runInInjectionContext().
     * Additionally this will trigger the TestBed configureTestingModule step. After this step you can not create any more mocks.
     * Make sure you create all your mocks before calling this method.
     * This method can be used to configure the testing module when used without 
     * @param callbackToBeRunInInjectionContext will be executed in injection context and its return value will be returned by run-method.
     * @returns what @param callbackToBeRunInInjectionContext would return
     */
    public run():void;
    public run<T>(callbackToBeRunInInjectionContext: ()=> T): T;
    public run<T = void>(callbackToBeRunInInjectionContext?: ()=> T): T {
        this.configurator.configureTestingModule();
        if(callbackToBeRunInInjectionContext){
            return TestBed.runInInjectionContext(()=> callbackToBeRunInInjectionContext());
        }
        return void(0) as T;
    }

}