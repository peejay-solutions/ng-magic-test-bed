import { Component, Input, OnInit } from '@angular/core';
import { ButtonComponent } from './button.component';
import { HandlerDirective, IHandler } from './handler.directive';
import { MyComponentService } from './my-component.service';
import { MyService } from './my.service';

@Component({
    selector: 'lib-sample',
    template: '@if (param>99) {<lib-button [handler]="handler" (click)="myService.doSomething()"></lib-button>}',
    providers: [MyComponentService],
    imports: [ButtonComponent, HandlerDirective],
    standalone: true,
})
export class SampleComponent implements OnInit {

    @Input()
    public param?: number;
    public value: number;

    public handler: IHandler = {
        handle: () => console.log('handle'),
    };

    constructor(public myService: MyService, private myComponentService: MyComponentService) {
        this.value = this.myComponentService.returnSomething();
    }

    public ngOnInit(): void {
        if (!this.param) {
            throw new Error('no param before first detect changes');
        }
    }
}
