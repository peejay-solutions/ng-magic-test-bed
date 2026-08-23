import { TestBed } from "@angular/core/testing";
import { ExampleService } from "./example.service";
import { HelperService } from "./helper.service";
import { NgMagicSetupTestBed } from "@peejay-solutions/ng-magic-test-bed";


describe('ExampleService', () => {

    function setup() {
        const magic = new NgMagicSetupTestBed();
        const helperServiceMock = magic.serviceMock(HelperService);
        const exampleService = magic.injection(ExampleService);
        return { exampleService, helperServiceMock };
    }

    it('doSomething() should use helperService to getData and doSomething', () => {
        const { exampleService, helperServiceMock } = setup();
        const param = 4;
        const data =  {value: 100};
        helperServiceMock.getData.and.returnValue(data)

        exampleService.doSomething(param);

        expect(helperServiceMock.getData).toHaveBeenCalledWith(4);
        expect(helperServiceMock.doSomething).toHaveBeenCalledWith(data.value);
    });

});
