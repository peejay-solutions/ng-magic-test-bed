import { ExampleService } from "./example.service";
import { HelperService } from "./helper.service";
import { NgMagicTestBed } from "../../public-api";


describe('ExampleService', () => {

    function setup() {
        const magic = new NgMagicTestBed();
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
