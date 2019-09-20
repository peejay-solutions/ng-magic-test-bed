import { TestBed, ComponentFixture, TestModuleMetadata, async } from '@angular/core/testing';
import {  SchemaMetadata } from '@angular/core';

type AbstractType<T> = Function & { prototype: T };

/**
 * @ignore
 */
export class TestBedBase {

    protected preJobs: Array<(config: TestModuleMetadata) => void> = [];
    protected postJobs: Array<() => void> = [];

    constructor(private initialConfig: TestModuleMetadata = {}) {
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


    public reset() {
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
