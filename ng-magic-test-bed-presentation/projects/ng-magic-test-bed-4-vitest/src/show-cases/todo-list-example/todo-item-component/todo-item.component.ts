import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DueInPipe } from '../due-in-pipe/due-in.pipe';
import { OverdueHighlightDirective } from '../overdue-highlight-directive/overdue-highlight.directive';
import { Todo } from '../todo-factory/todo.factory';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [DueInPipe, OverdueHighlightDirective],
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent {
  @Input({ required: true }) public todo!: Todo;
  @Output() public toggle = new EventEmitter<Todo>();

  public onToggle(): void {
    this.toggle.emit(this.todo);
  }
}
