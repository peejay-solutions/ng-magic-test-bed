import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Todo } from '../todo-factory/todo.factory';
import { TodoFactory } from '../todo-factory/todo.factory';
import { ISerializedTodo } from './i-serialized-todo';
import { ITodoInitParam } from './i-todo-init-param';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(
    private readonly http: HttpClient,
    private readonly todoFactory: TodoFactory,
  ) {
    this.reload();
  }

  private readonly todosSubject = new BehaviorSubject<Array<Todo>>([]);
  public readonly todos$ = this.todosSubject.asObservable();

  public async reload() {
    const serializedTodos = await firstValueFrom(this.http.get<ISerializedTodo[]>('/api/todos'));
    const todos = serializedTodos.map(serializedTodo => this.todoFactory.create(serializedTodo));
    this.todosSubject.next(todos);
  }


  public async add(title: string, dueDate: Date | null = null): Promise<void> {
    const todo = this.todoFactory.create({ title, dueDate });
    this.todosSubject.next([...this.todosSubject.getValue(), todo]);
    return firstValueFrom(this.http.post<void>('/api/todos', todo.serialize()));
  }

  public sendToggleDone(todoId: string, done: boolean): Promise<void> {
    return firstValueFrom(this.http.put<void>(`/api/todos/${todoId}`, done));
  }
}


