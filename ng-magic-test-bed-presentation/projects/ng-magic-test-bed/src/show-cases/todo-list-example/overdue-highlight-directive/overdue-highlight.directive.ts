import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appOverdueHighlight]',
  standalone: true,
})
export class OverdueHighlightDirective implements OnChanges {
  @Input('appOverdueHighlight') public dueDate: Date | null = null;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  public ngOnChanges(): void {
    const isOverdue = !!this.dueDate && this.dueDate.getTime() < Date.now();

    if (isOverdue) {
      this.renderer.addClass(this.el.nativeElement, 'overdue');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'overdue');
    }
  }
}
