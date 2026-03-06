import { inject, Injectable } from "@angular/core";
import { NgMagicSetupTestBed } from "ng-magic-test-bed";


@Injectable({
    providedIn: 'root'
})
class HelperService{
    public getSomething(){
        return 100;
    }
}

class MyObject{
    private helperService = inject(HelperService);
    public getSomething(){
        return this.helperService.getSomething();
    }
}

describe('Run in injection context use case', ()=> {

    it('A class that needs to be run in injection context should be testable with magic testbed', ()=> {
        const magic = new NgMagicSetupTestBed();
        const myObject: MyObject = magic.run(()=> new MyObject());
        expect(myObject).toBeDefined();
    });

    it('A class that needs to be run in injection context should have mockable dependencies', ()=> {
        const magic = new NgMagicSetupTestBed();
        const helperServiceMock = magic.serviceMock(HelperService);
        helperServiceMock.getSomething.and.returnValue(200);
        const myObject: MyObject = magic.run(()=> new MyObject());
        expect (myObject.getSomething()).toBe(200);
    });

});