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



describe('Pipe use case', () => {

    function setup() {
        const magic = new NgMagicTestBed();
        const childComponents = magic.componentMocks(ChildComponent);
        magic.pipeMock(DoubleUpPipe);
        const fixture = magic.fixture(ParentComponent);
        const childComponent = childComponents[0];
        return { fixture , childComponent};
    }

    it('asdas', () => {
        const { fixture, childComponent } = setup();


        expect(childComponent.value).toEqual(400)

    });
});