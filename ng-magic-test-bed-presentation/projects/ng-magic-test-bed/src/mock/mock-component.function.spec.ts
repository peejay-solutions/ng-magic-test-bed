import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { mockComponent } from './mock-component.function';

@Component({
    selector: 'lib-child',
    template: '<div>Original content (should not be rendered in test)</div>',
    standalone: true
})
class ChildComponent {
    @Input() title!: string;
    @Output() action = new EventEmitter<string>();
    additionalProperty = 100;
}

@Component({
    selector: 'lib-parent',
    template: `
    <lib-child 
      [title]="parentTitle" 
      (action)="onActionTriggered($event)">
    </lib-child>
  `,
    standalone: true,
    imports: [ChildComponent]
})
class ParentComponent {
    parentTitle = 'Initial Test Title';
    receivedValue = '';

    onActionTriggered(value: string) {
        this.receivedValue = value;
    }
}

describe('mockComponent()', () => {

    function setup() {
        const MockedChild = mockComponent(ChildComponent);
        TestBed.overrideComponent(ParentComponent, {
            set: {
                imports: [MockedChild]
            }
        })

        TestBed.configureTestingModule({
            imports: [
                ParentComponent,
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(ParentComponent);
        const parentComponent = fixture.componentInstance;
        fixture.detectChanges();

        const childDebugElement = fixture.debugElement.query(By.css('lib-child'));
        return {
            fixture, parentComponent, childDebugElement
        }
    }



    it('should generate a valid Angular component', () => {
        const { childDebugElement } = setup();
        expect(childDebugElement).toBeTruthy();
        expect(childDebugElement.nativeElement.textContent).not.toContain('Original content');
    });

    it('should correctly accept inputs from the parent component', () => {
        const { childDebugElement, parentComponent, fixture } = setup();
        const mockInstance = childDebugElement.componentInstance;
        expect(mockInstance.title).toBe('Initial Test Title');
        parentComponent.parentTitle = 'Updated Title';
        fixture.detectChanges();
        expect(mockInstance.title).toBe('Updated Title');
    });

    it('should automatically instantiate an EventEmitter for outputs and successfully emit events', () => {
        const { childDebugElement, parentComponent, fixture } = setup();
        const mockInstance = childDebugElement.componentInstance;
        expect(mockInstance.action).toBeTruthy();
        expect(typeof mockInstance.action.emit).toBe('function');
        mockInstance.action.emit('Hello from the mock!');
        fixture.detectChanges();
        expect(parentComponent.receivedValue).toBe('Hello from the mock!');
    });

    it('should not have any additional properties that are no inputs or outputs', () => {
        const { childDebugElement, parentComponent, fixture } = setup();
        expect(childDebugElement.componentInstance.additionalProperty).not.toBeDefined();
    });
});