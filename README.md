# ng-magic-test-bed

A magic test bed for angular. This Wrapper for the well known angular test bed (@angular/core/testing) allows you to remove a lot of bloat code form your spec files.

# Benefits

*Configuration of the test bed is done implicitly while assigning you local variables.
*All local variables to mocks, helper service and the testee itself can be defined as constants. 
*Reconfiguration of the test bed in beforeEach is reduced to of 1 line
*Creation of jasmine Spys for all your mocks' functions is done on the fly

#Sample

describe('MyService', () => {
    const magic = new NgMagicTestBed();
    const myHelperServiceMock = magic.mock(MyHelperService, MyHelperServiceMock);
    const service = magic.injection(MyService);
    const myTestHelperService = magic.injection(MyTestHelperService);

    beforeEach(magic.happen);

    it('should work', () => {
        expect(service).toBeTruthy();
    });
});
