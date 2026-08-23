import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'lib-button',
    template: '',
    standalone: true,
})
export class ButtonComponent {
    @Input() public text?: string;
    @Output() public click = new EventEmitter();
}
