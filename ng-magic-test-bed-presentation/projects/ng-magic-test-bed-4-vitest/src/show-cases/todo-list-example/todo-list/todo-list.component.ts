import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo-factory/todo.factory';
import { TodoItemComponent } from '../todo-item-component/todo-item.component';
import { TodoService } from '../todo-service/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [NgFor, TodoItemComponent, AsyncPipe, NgIf],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent {

  constructor(protected readonly todoService: TodoService) {}

  public onToggle(todo: Todo): void {
    todo.toggleDone();
    this.todoService.sendToggleDone(todo.id, todo.done);
  }

}
