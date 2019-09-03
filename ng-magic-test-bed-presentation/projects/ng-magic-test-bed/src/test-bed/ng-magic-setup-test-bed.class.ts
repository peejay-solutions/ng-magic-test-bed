import { TestBed, TestModuleMetadata, ComponentFixture } from '@angular/core/testing';
import { SchemaMetadata, Type, AbstractType } from '@angular/core';
import { spyOnFunctionsOf } from '../spy-on-mock/spy-on-functions-of.function';
import { Observable } from 'rxjs';
import { observe } from '../observe/observe.function';
import { SpyObserver } from '../observe/spy-observer.class';

export class NgMagicSetupTestBed {

    private config: TestModuleMetadata;
    private configured = false;

    constructor(initialConfig: TestModuleMetadata =  {}) {
        this.config = {
            providers: initialConfig.providers ? initialConfig.providers.slice() : [],
            declarations: initialConfig.declarations ? initialConfig.declarations.slice() : [],
            imports: initialConfig.imports ? initialConfig.imports.slice() : [],
            schemas: initialConfig.schemas ? initialConfig.schemas.slice() : [],
            aotSummaries: initialConfig.aotSummaries
        };
    }

    private configureTestingModule() {
        this.configured = true;
        TestBed.configureTestingModule(this.config);
    }

    private expectToBePreConfiguration() {
        if (this.configured) {
            throw new Error('The TestBed has been implicitly configured by calling e.g.' +
                '"injection" the method you called needs a not configured TestBed to be executed');
        }
    }

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

    public fixture<C>(componentClass: Type<C>, dontCompileAfterWards: boolean = false): ComponentFixture<C> {
        this.configureTestingModule();
        if (!this.config.declarations.includes(componentClass)) {
            throw new Error('Declaration of component needs to be done before you can create the fixture');
        }
        const fixture = TestBed.createComponent(componentClass);
        if (!dontCompileAfterWards) {
            TestBed.compileComponents();
        }
        return fixture;
    }

    public objectMock<O, M extends Partial<O>>(objectClass: AbstractType<O>, mock: M, dontSpy = false):
        Partial<O> & M | jasmine.SpyObj<Partial<O> & M> {
        return <Partial<O> & M | jasmine.SpyObj<Partial<O> & M>>this.mock(undefined, mock, dontSpy, objectClass);
    }

    public providerMock<M>(token: any, mock: M, dontSpy: boolean, spySource?: AbstractType<any>) {
        return this.mock(token, mock, dontSpy, spySource);
    }

    public factoryMock(factoryClass, instances: Array<any>) {
        let index = -1;
        return this.mock(factoryClass,  {
                create: (...args: any) => {
                    index++;
                    return args[index];
                }
        });
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
            spyOnFunctionsOf(mock, spySource.prototype);
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