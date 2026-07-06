import { TestBed, TestModuleMetadata, ComponentFixture } from '@angular/core/testing';
import { SchemaMetadata, Type, AbstractType, NO_ERRORS_SCHEMA, isStandalone } from '@angular/core';
import { spyOnFunctionsOf } from '../spy-on-functions/spy-on-functions-of.function';
import { SpyObj } from '../spy-framework/spy-framework';
import { By } from '@angular/platform-browser';
import { FullTestModuleMetadata } from './full-test-module-meta-data.interface';

export class TestBedConfigurator {

    /**
    * @ignore
    */
    private config: FullTestModuleMetadata;

    /**
    * @ignore
    */
    private configured = false;

    /**
    * @ignore
    */
    private compiled = false;

    /**
    * @ignore
    */
    private postConfigureJobs: Array<() => void> = [];

    /**
    * @ignore
    */
    private fixtureJobs: Array<() => void> = [];

    /**
    * @ignore
    */
    private fixtureInstance?: ComponentFixture<any> = undefined;

    /**
    * @ignore
    */
    private fixtureImports: Array<Type<any>> = [];

    /**
    * @param initialConfig  initial config which will be extended by the other methods of this NgMagicSetupTestBed instance.
    *  The final config will be used to call TestBed.configureTestingModule implicitly by
    * calling e.g. .injection()
    */
    constructor(initialConfig: TestModuleMetadata = {}) {
        this.config = {
            providers: initialConfig.providers ? initialConfig.providers.slice() : [],
            declarations: initialConfig.declarations ? initialConfig.declarations.slice() : [],
            imports: initialConfig.imports ? initialConfig.imports.slice() : [],
            schemas: initialConfig.schemas ? initialConfig.schemas.slice() : [],
            errorOnUnknownElements: initialConfig.errorOnUnknownElements ?? false,
            errorOnUnknownProperties: initialConfig.errorOnUnknownProperties ?? false,
            teardown: {
                destroyAfterEach: initialConfig.teardown?.destroyAfterEach ?? true,
                rethrowErrors: initialConfig.teardown?.rethrowErrors ?? false
            }
        };
    }

    /**
    * @ignore
    */
    public configureTestingModule() {
        if (this.configured) {
            return;
        }
        this.configured = true;
        TestBed.configureTestingModule(this.config);
        this.postConfigureJobs.forEach(job => job());
        this.postConfigureJobs.length = 0;
    }

    /**
    * @ignore
    */
    private expectToBePreConfiguration() {
        if (this.configured) {
            throw new Error('The TestBed has been implicitly configured by calling e.g.' +
                '"injection" or "fixture" the method you called needs a not configured TestBed to be executed');
        }
    }
    public declarations(declarations: Array<any>) {
        this.expectToBePreConfiguration();
        this.config.declarations.push(...declarations);
    }


    public schemas(schemas: Array<SchemaMetadata | any[]>) {
        this.expectToBePreConfiguration();
        this.config.schemas.push(...schemas);
    }


    public imports(imports: any[]) {
        this.expectToBePreConfiguration();
        this.config.imports.push(...imports);
    }

    public providers(providers: any[]) {
        this.expectToBePreConfiguration();
        this.config.providers.push(...providers);
    }



    /**
    * @ignore
    */
    public uiThingProviderMock<M>(methodName: string, uiThingClass: Type<any>, token: any, mock: M, dontSpy = false,
        spySource?: AbstractType<any>): M {
        this.expectToBePreConfiguration();
        if (!dontSpy) {
            spyOnFunctionsOf(mock, spySource ? spySource.prototype : undefined);
        }
        if (!this.config.declarations.includes(uiThingClass) && !isStandalone(uiThingClass)) {
            this.config.declarations.push(uiThingClass);
        }
        if (isStandalone(uiThingClass) && !this.config.imports.includes(uiThingClass)) {
            this.config.imports.push(uiThingClass);
        }
        this.postConfigureJobs.push(() => {
            (TestBed as any)[methodName](uiThingClass, {
                add: {
                    providers: [
                        { provide: token, useValue: mock }
                    ]
                }
            });
        });
        return mock;
    }



    public addToImportsOrDeclarations(uiThingClass: Type<any>) {
        if (isStandalone(uiThingClass) && !this.fixtureImports.includes(uiThingClass)) {
            this.fixtureImports.push(uiThingClass)
        }
        if (isStandalone(uiThingClass) && !this.config.imports.includes(uiThingClass)) {
            this.config.imports.push(uiThingClass);
        }
        if (!isStandalone(uiThingClass) && !this.config.declarations.includes(uiThingClass)) {
            this.config.declarations.push(uiThingClass);
        }
    }

    public keptComponents<C>(componentClass: Type<C>): Array<C> {
        const instances = this.useInFixtureAndQueryInstances(componentClass);
        this.overrideImportsIfStandalone(componentClass);
        return instances;
    }

    public overrideImportsIfStandalone(componentClass: Type<any>) {
        if (!isStandalone(componentClass)) {
            return;
        }
        if (!this.configured) {
            this.postConfigureJobs.push(() => {
                TestBed.overrideComponent(componentClass, {
                    set: {
                        imports: this.fixtureImports
                    }
                });
            });
        } else {
            TestBed.overrideComponent(componentClass, {
                set: {
                    imports: this.fixtureImports
                }
            });
        }

    }

    public useInFixtureAndQueryInstances<C>(componentClass: Type<C>): Array<C> {
        const result: Array<any> = ['this array can only be used after fixture() was called'];
        this.expectToBePreConfiguration();

        this.addToImportsOrDeclarations(componentClass);

        this.fixtureJobs.push(() => {
            result.length = 0;
            const componentDebugElements = this.fixtureInstance?.debugElement.queryAll(By.directive(componentClass));
            componentDebugElements?.forEach(componentDebugElement => result.push(componentDebugElement.injector.get(componentClass)));
        });
        return result;
    }

    public fixture<C>(componentClass: Type<C>, initialInputs: Partial<C> = {}, disableNoErrorSchema = false): ComponentFixture<C> {
        if (this.fixtureInstance) {
            throw new Error('.fixture can only be called once per NgMagicTestBed instance');
        }
        if (!this.config.declarations.includes(componentClass) && this.configured) {
            throw new Error('Declaration of component needs to be done before you can create the fixture');
        }

        if (isStandalone(componentClass) && !this.configured) {
            this.config.imports.push(componentClass);
        }
        if (!isStandalone(componentClass) && !this.config.declarations.includes(componentClass) && !this.configured) {
            this.config.declarations.push(componentClass);
        }

        if (!disableNoErrorSchema && !this.config.schemas.includes(NO_ERRORS_SCHEMA)) {
            this.config.schemas.push(NO_ERRORS_SCHEMA);
        }
        if (!this.configured) {
            this.configureTestingModule();
        }
        this.overrideImportsIfStandalone(componentClass);
        if (!this.compiled) {
            this.compiled = true;
            //TODO: This seems to be declared as async but it in reality it does not seems to be.
            TestBed.compileComponents();
        }
        this.fixtureInstance = TestBed.createComponent(componentClass);
        Object.assign(this.fixtureInstance.componentInstance, initialInputs);
        this.fixtureInstance.detectChanges();
        this.fixtureJobs.forEach(job => job());
        return this.fixtureInstance;
    }


    /**
    * @ignore
    */
    public mock<S, M extends Partial<S>>(token?: any, mock: M = <any>{}, dontSpy?: boolean, spySource?: AbstractType<S>):
        S & M | SpyObj<S> & M | SpyObj<S> {
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
        return <any>mock;
    }



}