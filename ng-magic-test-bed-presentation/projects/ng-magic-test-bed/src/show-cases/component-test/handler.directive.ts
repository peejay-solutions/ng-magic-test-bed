import { Directive, Input } from '@angular/core';

export interface IHandler {
    handle(): void;
}

@Directive({
    selector: '[handler]',
    standalone: true,
})
export class HandlerDirective {
    @Input() public handler?: IHandler;
}
