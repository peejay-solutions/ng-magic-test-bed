import { Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { mockComponent } from '../public-api';

// Covers the standalone mockComponent(componentClass) function.
// magic.componentMocks() uses exactly this function internally
// (`const componentMock = mockComponent(componentClass);`) - use the
// standalone version directly if you want the generated mock TYPE itself
// (e.g. to add it to a raw TestBed config) instead of going through
// NgMagicSetupTestBed.

@Component({
    selector: 'app-alert',
    standalone: true,
    template: `{{ message }}`,
})
class AlertComponent {
    @Input('alertMessage') public message = '';
    @Input() public dismissible = true;
    @Output('closed') public closeRequested = new EventEmitter<void>();
}


class NotAComponent {}

describe('mockComponent()', () => {

    it('should generate a standalone component type that keeps the original selector', () => {
        const AlertMock = mockComponent(AlertComponent);
        // const array: Array<Type<any>> =[AlertMock];

        @Component({
            selector: 'selector-check-host',
            standalone: true,
            imports:  [AlertComponent],
            template: `<app-alert></app-alert>`,
        })
        class SelectorCheckHostComponent {}

        TestBed.configureTestingModule({ imports: [SelectorCheckHostComponent] });
        TestBed.overrideComponent(SelectorCheckHostComponent, {
            remove:{
                imports: [AlertComponent]
            },
            add: {
                imports: [mockComponent(AlertComponent)]
            }
        })

        // If the mock's selector didn't match 'app-alert', Angular would throw
        // "is not a known element" while compiling this template.
        expect(() => TestBed.createComponent(SelectorCheckHostComponent)).not.toThrow();
    });

    it('should map aliased and non-aliased @Input()s so template bindings still work', () => {
        @Component({
            selector: 'alias-input-host',
            standalone: true,
            imports: [AlertComponent],
            template: `<app-alert [alertMessage]="'hi'" [dismissible]="false"></app-alert>`,
        })
        class AliasInputHostComponent {}
        TestBed.overrideComponent(AliasInputHostComponent, {
            remove:{
                imports: [AlertComponent]
            },
            add: {
                imports: [mockComponent(AlertComponent)]
            }
        });

        TestBed.configureTestingModule({ imports: [AliasInputHostComponent] });
        const fixture = TestBed.createComponent(AliasInputHostComponent);
        fixture.detectChanges();

        const alertMockInstance = fixture.debugElement.children[0].componentInstance;
        expect(alertMockInstance.message).toBe('hi');
        expect(alertMockInstance.dismissible).toBe(false);
    });

    it('should map @Output()s as real EventEmitters, respecting aliases', () => {
        const AlertMock = mockComponent(AlertComponent);

        @Component({
            selector: 'alias-output-host',
            standalone: true,
            imports: [AlertComponent],
            template: `<app-alert (closed)="onClosed()"></app-alert>`,
        })
        class AliasOutputHostComponent {
            public wasClosed = false;

            public onClosed(): void {
                this.wasClosed = true;
            }
        }

        TestBed.configureTestingModule({ imports: [AliasOutputHostComponent] });
        const fixture = TestBed.createComponent(AliasOutputHostComponent);
        fixture.detectChanges();

        const alertMockInstance = fixture.debugElement.children[0].componentInstance;
        alertMockInstance.closeRequested.emit();

        expect(fixture.componentInstance.wasClosed).toBe(true);
    });

    it('should throw when given a class that is not an Angular component', () => {
        expect(() => mockComponent(NotAComponent)).toThrowError(
            'Class NotAComponent is no Angular Component',
        );
    });

});
