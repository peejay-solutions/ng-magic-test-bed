import { TestBed } from "@angular/core/testing";
import { ExampleService } from "./example.service";
import { HelperService } from "./helper.service";


describe('ExampleService', () => {
    let exampleService: ExampleService;
    let helperServiceMock: HelperServiceMock;

    beforeEach(() => {
        helperServiceMock = new HelperServiceMock();
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HelperService,
                    useValue: helperServiceMock
                },
            ]
        });
        exampleService = TestBed.inject(ExampleService);
    });

    it('doSomething() should use helperService to getData and doSomething', () => {
        const param = 4;
        const data =  {value: 100};
        helperServiceMock.getData.and.returnValue(data)

        exampleService.doSomething(param);

        expect(helperServiceMock.getData).toHaveBeenCalledWith(4);
        expect(helperServiceMock.doSomething).toHaveBeenCalledWith(data.value);
    });
});

class HelperServiceMock implements Partial<HelperService> {
    public doSomething = jasmine.createSpy('doSomething');
    public getData = jasmine.createSpy('getData');
}