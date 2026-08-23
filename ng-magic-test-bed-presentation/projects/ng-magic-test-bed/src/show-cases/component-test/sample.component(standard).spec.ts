import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { mockComponent } from '../../mock/mock-component.function';
import { ButtonComponent } from './button.component';
import { MyComponentService } from './my-component.service';
import { MyService } from './my.service';
import { SampleComponent } from './sample.component';

class MyComponentServiceMock implements Partial<MyComponentService> {
    public returnSomething = jasmine.createSpy('returnSomething').and.returnValue(3);
}

class MyServiceMock implements Partial<MyService> {
    public doSomething = jasmine.createSpy('doSomething');
}

const ButtonComponentMock = mockComponent(ButtonComponent);

describe('SampleComponent(standard)', () => {
    let fixture: ComponentFixture<SampleComponent>;
    let myComponentServiceMock: MyComponentServiceMock;
    let myServiceMock: MyServiceMock;
    let buttonComponentMock: InstanceType<typeof ButtonComponentMock>;

    beforeEach(() => {
        myServiceMock = new MyServiceMock();
        myComponentServiceMock = new MyComponentServiceMock();

        TestBed.configureTestingModule({
            imports: [SampleComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: MyService, useValue: myServiceMock },
            ],
        });
        TestBed.overrideComponent(SampleComponent, {
            remove: {
                imports: [ButtonComponent],
            },
            add: {
                imports: [ButtonComponentMock],
                providers: [{ provide: MyComponentService, useValue: myComponentServiceMock }],
            },
        });
        TestBed.compileComponents();

        fixture = TestBed.createComponent(SampleComponent);
        fixture.componentInstance.param = 100;
        fixture.detectChanges();
        buttonComponentMock = fixture.debugElement.query(By.directive(ButtonComponentMock)).componentInstance;
    });

    it('should pass the param through and read value from the component-scoped service', () => {
        expect(fixture.componentInstance.param).toEqual(100);
        expect(myComponentServiceMock.returnSomething).toHaveBeenCalled();
        expect(fixture.componentInstance.value).toEqual(3);
    });

    it('should call the root-provided service when the button emits click', () => {
        buttonComponentMock.click.emit({ isEvent: true });

        expect(myServiceMock.doSomething).toHaveBeenCalled();
    });

});
