import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dueIn',
  standalone: true,
})
export class DueInPipe implements PipeTransform {
  public transform(dueDate: Date | null): string {
    if (!dueDate) {
      return '';
    }

    const diffInMs = dueDate.getTime() - Date.now();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return 'overdue';
    }
    if (diffInDays === 0) {
      return 'due today';
    }
    return `due in ${diffInDays} day${diffInDays === 1 ? '' : 's'}`;
  }
}
