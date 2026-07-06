import { Component, Input, Pipe } from "@angular/core";
import { NgMagicTestBed } from "../test-bed/ng-magic-test-bed.class";



@Pipe({ name: 'doubleUp' })
class DoubleUpPipe {
    public transform(value: number) {
        return value * 2;
    }
}

@Component({
    selector: 'lib-child',
    template: '{{value}}',
    standalone: true
})
class ChildComponent {
    @Input()
    public value: number = 0;
}



@Component({
    selector: 'lib-parent',
    template: '<lib-child [value]="value | doubleUp"></lib-child>',
    standalone: true,
    imports: [DoubleUpPipe, ChildComponent]
})
class ParentComponent {
    public value = 200;
}



describe('Pipe use case with custom spy', () => {

    function setup() {
        const magic = new NgMagicTestBed();
        const childComponents = magic.componentMocks(ChildComponent);
        const pipeSpy =  magic.pipeMock('doubleUp', ()=> 42);
        const fixture = magic.fixture(ParentComponent);
        const childComponent = childComponents[0];
        return { fixture , childComponent, pipeSpy};
    }

    it('should use custom spy and return 42', () => {
        const { childComponent, pipeSpy } = setup();

        expect(pipeSpy).toHaveBeenCalledWith(200)
        expect(childComponent.value).toEqual(42);

    });
});


describe('Pipe use case with default spy', () => {

    function setup() {
        const magic = new NgMagicTestBed();
        const childComponents = magic.componentMocks(ChildComponent);
        const pipeSpy =  magic.pipeMock('doubleUp');
        const fixture = magic.fixture(ParentComponent);
        const childComponent = childComponents[0];
        return { fixture , childComponent, pipeSpy};
    }

    it('should use default spy and return the same value that was put in', () => {
        const { childComponent, pipeSpy } = setup();
        expect(pipeSpy).toHaveBeenCalledWith(200)
        expect(childComponent.value).toEqual(200);
    });
});



describe('Pipe use case with kept pipe as it is', () => {

    function setup() {
        const magic = new NgMagicTestBed();
        const childComponents = magic.componentMocks(ChildComponent);
        magic.keptPipe(DoubleUpPipe);
        const fixture = magic.fixture(ParentComponent);
        const childComponent = childComponents[0];
        return { fixture , childComponent};
    }

    it('should use the kept pipe and therefore return doubled value', () => {
        const { childComponent } = setup();
        expect(childComponent.value).toEqual(400);
    });
});