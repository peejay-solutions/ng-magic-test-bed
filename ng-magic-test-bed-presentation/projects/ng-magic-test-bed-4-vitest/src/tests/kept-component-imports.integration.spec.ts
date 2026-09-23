import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgMagicTestBed } from '../public-api';

// Covers keptComponentImports(Array<Type<any>>)
// Batch shorthand for keeping several pipes/directives/standalone components
// as their real implementation in one call, instead of calling keptPipe()
// once per item. Exists mainly because fixture() always replaces a
// standalone root component's imports array with its (initially empty)
// fixtureImports list - so structural directives/pipes the template relies
// on (NgIf, NgFor, AsyncPipe, ...) silently stop working unless they are
// explicitly kept. See also CLAUDE.md's gotcha #1 for more background.

@Injectable({ providedIn: 'root' })
class GreetingService {
    public readonly greeting$ = new BehaviorSubject<string | null>(null);
}

@Component({
    selector: 'greeting-host',
    standalone: true,
    imports: [NgIf, AsyncPipe],
    template: `<span *ngIf="greetingService.greeting$ | async as greeting">{{ greeting }}</span>`,
})
class GreetingHostComponent {
    constructor(protected readonly greetingService: GreetingService) { }
}

describe('keptComponentImports()', () => {

    it('should keep several structural directives/pipes as their real implementation in one call', () => {
        const magic = new NgMagicTestBed();
        magic.keptComponentImports([NgIf, AsyncPipe]);
        const greetingServiceMock = magic.serviceMock(GreetingService, {
            greeting$: new BehaviorSubject<string | null>('hello'),
        });

        const fixture = magic.fixture(GreetingHostComponent);

        // Without keeping NgIf/AsyncPipe here, *ngIf would never materialize
        // its content at all (see CLAUDE.md gotcha #1) - this proves both
        // were kept and are working together.
        expect(fixture.nativeElement.querySelector('span').textContent.trim()).toBe('hello');
        expect(greetingServiceMock.greeting$).toBeTruthy();
    });

    it('should not render the *ngIf content when nothing has been kept', () => {
        const magic = new NgMagicTestBed();
        // fixture() always replaces a standalone root component's imports
        // with its (here: empty) fixtureImports list - without keeping
        // NgIf/AsyncPipe explicitly, they are gone and *ngIf never
        // materializes its content, regardless of what else is mocked.
        magic.serviceMock(GreetingService, {
            greeting$: new BehaviorSubject<string | null>('hello'),
        });
        magic.keptPipe(AsyncPipe);

        const fixture = magic.fixture(GreetingHostComponent);

        expect(fixture.nativeElement.querySelector('span')).toBeNull();
    });

});
