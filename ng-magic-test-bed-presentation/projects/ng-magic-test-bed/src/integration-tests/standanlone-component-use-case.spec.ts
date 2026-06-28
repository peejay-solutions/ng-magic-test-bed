import { Component, Injectable, Output, Input, EventEmitter, OnInit, CUSTOM_ELEMENTS_SCHEMA, Directive, NO_ERRORS_SCHEMA, reflectComponentType } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgMagicSetupTestBed } from '../test-bed/ng-magic-setup-test-bed.class';
import { By } from '@angular/platform-browser';
import { mockComponent, observe } from '../public-api';


@Injectable()
export class MyService {
    doSomething() {
        return 2;
    }
}

@Injectable()
export class MyComponentService {
    returnSomething() {
        return 2;
    }
}

@Component({
    selector: 'lib-button',
    template: '',
    standalone: true
})
export class MyButtonComponent {
    @Input() public text?: string;
    @Output() public click = new EventEmitter();
}

export interface IHandler {
    handle(): void;
}

@Directive({
    selector: '[handler]',
    standalone: true
})
export class MyHandlerDirective {
    @Input() public handler?: IHandler
}

@Component({
    selector: 'lib-sample',
    template: '@if (param>99) {<lib-button [handler]="handler" (click)="myService.doSomething()"></lib-button>}',
    providers: [MyComponentService],
    imports: [MyButtonComponent, MyHandlerDirective],
    standalone: true
})
export class SampleComponent implements OnInit {

    @Input()
    public param?: number;
    public value: number;
    constructor(public myService: MyService, private myComponentService: MyComponentService) {
        this.value = this.myComponentService.returnSomething();
    }

    public handler = {
        handle: () => console.log('handle')
    }

    ngOnInit(): void {
        if (!this.param) {
            throw new Error('no param before first detect changes');
        }
    }
}

//################# Ng Magic Test Bed Test ####################################################################

describe('standalone component use case with NgMagicTestBed', () => {
    function setup() {
        const magic = new NgMagicSetupTestBed();
        const foundButtonComponents = magic.componentMocks(MyButtonComponent);
        const myComponentServiceMock = magic.componentServiceMock(SampleComponent, MyComponentService, {
            returnSomething: ()=> 3
        });
        const foundDirectiveInstances = magic.directiveMocks(MyHandlerDirectiveMock);
        magic.keptDirectives(MyHandlerDirective);
        const myServiceMock = magic.serviceMock(MyService);
        const fixture = magic.fixture(SampleComponent, { param: 100 });
        const buttonComponentMock = foundButtonComponents[0];
        return { fixture, myComponentServiceMock, buttonComponentMock, myServiceMock, foundDirectiveInstances };
    }

    it('should work', () => {
        const { fixture, buttonComponentMock, myComponentServiceMock, myServiceMock, foundDirectiveInstances } = setup();
        expect(fixture).toBeTruthy();
        expect(fixture.componentInstance.param).toEqual(100);
        expect(myComponentServiceMock.returnSomething).toHaveBeenCalled();
        expect(fixture.componentInstance.value).toEqual(3);
        const observer = observe(buttonComponentMock.click);
        buttonComponentMock.click.emit({ isEvent: true });
        expect(observer.next).toHaveBeenCalled();
        expect(myServiceMock.doSomething).toHaveBeenCalled();
        expect(foundDirectiveInstances[0].handler).toBe(fixture.componentInstance.handler);
    });

});

@Directive({
    selector: '[handler]',
    standalone: true
})
export class MyHandlerDirectiveMock {
    @Input() public handler?: IHandler
}


//##### Standard Test Bed ##########################################################################################

describe('standalone component use case with standard TestBed', () => {
    let fixture: ComponentFixture<SampleComponent>;
    let myComponentServiceMock: MyComponentServiceMock2;
    let myServiceMock: MyServiceMock;
    let buttonComponentMock: MyButtonComponentMock;

    beforeEach(() => {
        myServiceMock = new MyServiceMock();
        const MyButtonComponentMock3 = mockComponent(MyButtonComponentMock)
        TestBed.configureTestingModule({
            imports: [SampleComponent,MyButtonComponentMock3],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [{ provide: MyService, useValue: myServiceMock }],
            errorOnUnknownProperties: false,
            errorOnUnknownElements: false,
        });
        myComponentServiceMock = new MyComponentServiceMock2();
        TestBed.overrideComponent(SampleComponent, {
            add: {
                providers: [{ provide: MyComponentService, useValue: myComponentServiceMock }],
            }
        });
        TestBed.overrideComponent(SampleComponent, {
            remove: {
                imports: [MyButtonComponent]
            },
            add: {
                imports: [MyButtonComponentMock3]
            }
        });
        TestBed.compileComponents();
        fixture = TestBed.createComponent(SampleComponent);
        fixture.componentInstance.param = 100;
        fixture.detectChanges();
        buttonComponentMock = fixture.debugElement.query(By.directive(MyButtonComponentMock3)).componentInstance;
    });

    it('should work', () => {
        expect(fixture).toBeTruthy();
        expect(fixture.componentInstance.param).toEqual(100);
        expect(myComponentServiceMock.returnSomething).toHaveBeenCalled();
        expect(fixture.componentInstance.value).toEqual(3);
        buttonComponentMock.click.emit({ isEvent: true });
        expect(myServiceMock.doSomething).toHaveBeenCalled();
    });
});

class MyComponentServiceMock2 implements Partial<MyComponentService> {
    returnSomething = jasmine.createSpy('returnSomething').and.returnValue(3);
}

@Component({
    selector: 'lib-button',
    template: '',
    standalone: true
})
export class MyButtonComponentMock implements Partial<MyButtonComponent> {
    @Output() public click = new EventEmitter();
}

class MyServiceMock implements Partial<MyService> {
    doSomething = jasmine.createSpy('doSomething');
}

