import { SchemaMetadata } from "@angular/core";
import { TestModuleMetadata } from "@angular/core/testing";

/**
 * Implementation detail of NgMagicTestBed - not part of the public API.
 * @internal
 */
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
