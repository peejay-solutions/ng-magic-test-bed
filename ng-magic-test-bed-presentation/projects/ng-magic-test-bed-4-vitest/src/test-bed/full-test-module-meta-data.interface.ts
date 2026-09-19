import { SchemaMetadata } from "@angular/core";
import { TestModuleMetadata } from "@angular/core/testing";

export interface FullTestModuleMetadata extends TestModuleMetadata{
    providers: any[];
    declarations: any[];
    imports: any[];
    schemas: Array<SchemaMetadata | any[]>;
    teardown: {
        destroyAfterEach: boolean;
        rethrowErrors: boolean;
    };
    errorOnUnknownElements: boolean;
    errorOnUnknownProperties: boolean;
}
