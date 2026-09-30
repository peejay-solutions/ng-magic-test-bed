import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IdGeneratorService {
  private counter = 0;

  public generate(): string {
    this.counter++;
    return `todo-${this.counter}-${Date.now()}`;
  }
}
