# ng-magic-test-bed

A magic test bed for angular. This Wrapper for the well known angular test bed (@angular/core/testing) allows you to remove a lot of bloat code form your spec files.

# Benefits

- Configuration of the test bed is done implicitly while assigning you local variables

- All local variables to mocks, helper service and the testee itself can be defined as constants

- Reconfiguration of the test bed in beforeEach is reduced to of 1 line

- Creation of jasmine spies for all your mocks' functions is done on the fly

# Installation 

npm install @peejay-solutions/ng-magic-test-bed --save

https://www.npmjs.com/package/@peejay-solutions/ng-magic-test-bed

# Sample

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

More details including the usage of the implicitly generated spies can be found <a href="https://github.com/peejay-solutions/ng-magic-test-bed/blob/master/ng-magic-test-bed-presentation/projects/ng-magic-test-bed/src/test-bed/ng-magic-test.bed.class.spec.ts">here</a>

# Concept

Working with Reflection and pointers should not be considered as bad style to create a freshly initialized sterile test environment with mocks and spies for each test case. With this mindset and the methods Object.getOwnPropertyNames and Object.getPrototypeOf as well as Object.setPrototypeOf I was able to create a this library. 


#Documentation

... Work in progress.






