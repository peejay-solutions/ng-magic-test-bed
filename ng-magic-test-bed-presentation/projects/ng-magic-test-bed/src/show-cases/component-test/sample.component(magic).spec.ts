import { NgMagicSetupTestBed } from '../../setup-test-bed/ng-magic-setup-test-bed.class';
import { observe } from '../../observe/observe.function';
import { ButtonComponent } from './button.component';
import { HandlerDirective } from './handler.directive';
import { MyComponentService } from './my-component.service';
import { MyService } from './my.service';
import { SampleComponent } from './sample.component';

describe('SampleComponent(magic)', () => {

    function setup() {
        const magic = new NgMagicSetupTestBed();
        const buttonComponentMocks = magic.componentMocks(ButtonComponent);
        const myComponentServiceMock = magic.componentServiceMock(SampleComponent, MyComponentService, {
            returnSomething: () => 3,
        });
        const handlerDirectiveMocks = magic.keptDirectives(HandlerDirective);
        const myServiceMock = magic.serviceMock(MyService);

        const fixture = magic.fixture(SampleComponent, { param: 100 });

        return { fixture, buttonComponentMock: buttonComponentMocks[0], myComponentServiceMock, myServiceMock, handlerDirectiveMocks };
    }

    it('should pass the param through and read value from the component-scoped service', () => {
        const { fixture, myComponentServiceMock } = setup();

        expect(fixture.componentInstance.param).toEqual(100);
        expect(myComponentServiceMock.returnSomething).toHaveBeenCalled();
        expect(fixture.componentInstance.value).toEqual(3);
    });

    it('should call the root-provided service when the button emits click', () => {
        const { buttonComponentMock, myServiceMock } = setup();

        buttonComponentMock.click.emit({ isEvent: true });

        expect(myServiceMock.doSomething).toHaveBeenCalled();
    });

    it('should pass the real handler object through to the kept directive', () => {
        const { fixture, handlerDirectiveMocks } = setup();

        expect(handlerDirectiveMocks[0].handler).toBe(fixture.componentInstance.handler);
    });

    it('should let an observer see emissions from the mocked child component', () => {
        const { buttonComponentMock } = setup();
        const observer = observe(buttonComponentMock.click);

        buttonComponentMock.click.emit({ isEvent: true });

        expect(observer.next).toHaveBeenCalled();
    });

});
