import { Injectable } from "@angular/core";
import { NgMagicSetupTestBed } from "ng-magic-test-bed";

@Injectable({providedIn: 'root'})
class MyService{


    constructor(private myHelperService: MyHelperService){

    }

    public doIt(){
        this.myHelperService.doSomething();
    }

    public getIt(param: number): number{
        return this.myHelperService.getSomeOtherThing(param + 2);
    }
}

@Injectable({providedIn: 'root'})
class MyHelperService{
    doSomething(): void{
        
    }

    getSomeOtherThing(param: number): number{
        return param + 3;
    }
}



describe('NgMagicSetupTestBed.serviceMock()', ()=>{


    describe('should mock the given service and create spies for each method on the prototype', ()=>{
        function setup(){
            const magic = new NgMagicSetupTestBed();
            const myHelperServiceMock = magic.serviceMock(MyHelperService);
            const myServiceTestee = magic.injection(MyService);
    
            return {
                myHelperServiceMock, myServiceTestee
            }
        }

        it('.doIt() should trigger helper.doSomething', ()=>{
            const {  myHelperServiceMock, myServiceTestee } = setup();
            myServiceTestee.doIt();
            expect(myHelperServiceMock.doSomething).toHaveBeenCalledTimes(1);
        })
      
        it('.getIt() should add 2 and use helper.getSomething()', ()=>{
            const {  myHelperServiceMock, myServiceTestee } = setup();
            myHelperServiceMock.getSomeOtherThing.and.returnValue(100);
            const param = 4;
            const result = myServiceTestee.getIt(param);
            expect(myHelperServiceMock.getSomeOtherThing).toHaveBeenCalledWith(6);
            expect(result).toEqual(100);
        }); 
    });

    describe('should mock the given service and create spies for each method on the prototype and also take the mock as basis object', ()=>{
      
        function setup(){
            const magic = new NgMagicSetupTestBed();
            const myHelperServiceMock = magic.serviceMock(MyHelperService, { getSomeOtherThing: param => param, id: 1 });
            const myServiceTestee = magic.injection(MyService);
    
            return {
                myHelperServiceMock, myServiceTestee
            }
        }
        
        it('.doIt() should trigger helper.doSomething', ()=>{
            const {  myHelperServiceMock, myServiceTestee } = setup();
            myServiceTestee.doIt();
            expect(myHelperServiceMock.doSomething).toHaveBeenCalledTimes(1);
        })
      
        it('.getIt() should add 2 and use helper.getSomething()', ()=>{
            const {  myHelperServiceMock, myServiceTestee } = setup();
            const param = 4;
            const result = myServiceTestee.getIt(param);
            expect(myHelperServiceMock.getSomeOtherThing).toHaveBeenCalledWith(6);
            expect(result).toEqual(6);
            expect(myHelperServiceMock.id).toEqual(1);
        }); 
    });

    describe('should mock the given service and create spies for each method on the prototype and also take a full blown mock as basis object', ()=>{
      
        function setup(){
            const magic = new NgMagicSetupTestBed();
            const myHelperServiceMock = magic.serviceMock(MyHelperService, new MyHelperServiceMock());
            const myServiceTestee = magic.injection(MyService);
    
            return {
                myHelperServiceMock, myServiceTestee
            }
        }
        
        it('.doIt() should trigger helper.doSomething', ()=>{
            const {  myHelperServiceMock, myServiceTestee } = setup();
            myServiceTestee.doIt();
            expect(myHelperServiceMock.doSomething).toHaveBeenCalledTimes(1);
        })
      
        it('.getIt() should add 2 and use helper.getSomething()', ()=>{
            const {  myHelperServiceMock, myServiceTestee } = setup();
            const param = 4;
            const result = myServiceTestee.getIt(param);
            expect(myHelperServiceMock.getSomeOtherThing).toHaveBeenCalledWith(6);
            expect(result).toEqual(6);
            expect(myHelperServiceMock.id).toEqual(1);
        }); 
    });
      
    class MyHelperServiceMock implements Partial<MyHelperService>{
        public getSomeOtherThing(param: number): number {
            return param;
        }
        public id = 1;
    }
});