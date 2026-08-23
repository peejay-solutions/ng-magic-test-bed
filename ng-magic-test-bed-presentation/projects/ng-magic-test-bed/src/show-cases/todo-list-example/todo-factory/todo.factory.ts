import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { IdGeneratorService } from '../id-generator-service/id-generator.service';
import { ISerializedTodo } from '../todo-service/i-serialized-todo';
import { ITodoInitParam } from '../todo-service/i-todo-init-param';


export class Todo {
  private readonly idGeneratorService = inject(IdGeneratorService);
  public readonly id: string;
  public title: string;
  public done: boolean = false;
  public dueDate: Date | null;

  constructor(
    param: ITodoInitParam | ISerializedTodo
  ) {

    this.id = (param as ISerializedTodo).id ?? this.idGeneratorService.generate();
    this.title = param.title;
    this.done = (param as ISerializedTodo).done ?? false;
    this.dueDate = param.dueDate ?? null;
  }


  public toggleDone(): void {
    this.done = !this.done;
  }

  public isOverdue(): boolean {
    return !this.done && !!this.dueDate && this.dueDate.getTime() < Date.now();
  }

  public serialize(): ISerializedTodo {
    return {
      id: this.id,
      done: this.done,
      dueDate: this.dueDate,
      title: this.title
    }
  }
}


/**
 * Classic factory-pattern service: injectable, has a public create() method
 * that builds instances of another class (Todo). See llms.txt / IFactory.
 */
@Injectable({ providedIn: 'root' })
export class TodoFactory {
  private injector = inject(Injector);

  public create(param: ITodoInitParam | ISerializedTodo): Todo {
    return runInInjectionContext(this.injector, () => new Todo(param));
  }
}
