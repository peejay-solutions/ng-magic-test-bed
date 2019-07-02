import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IGameViewModel, CellState, ICell, IVector } from './i-game-view-model';

@Injectable({
  providedIn: 'root'
})
export class GameStoreService {

  private subject = new BehaviorSubject<IGameViewModel>(null);
  public observable = this.subject.asObservable();
  constructor() {
    const cells: Array<Array<ICell>> = [];
    for (let i = 0; i < 9; i++) {
      const column = [];
      cells.push(column);
      for (let j = 0; i < 9; j++) {
        column.push({ vector: { x: i, y: j }, value: 0, state: CellState.hidden, neighbors: [] });
      }
    }


    cells.forEach((column, x) => column.forEach((cell, y) => {
      cell.neighbors = [
        getVector(x - 1, y - 1), getVector(x, y - 1), getVector(x + 1, y - 1),
        getVector(x - 1, y), getVector(x + 1, y),
        getVector(x - 1, y + 1), getVector(x, y + 1), getVector(x + 1, y + 1)
      ];
    }));

    let bombs = 0;
    while (bombs < 10) {
      const x = Math.floor(Math.random() * 9);
      const y = Math.floor(Math.random() * 9);
      const cell = this.getCellFromCells(cells, { x, y });
      if (cell) {
        cell.value = -1;
        const neighbors = cell.neighbors.map(vector => this.getCellFromCells(cells, vector));
        neighbors.forEach(neighbor => {
          if (neighbor && neighbor.value >= 0) {
            neighbor.value++;
          }
        });
        bombs++;
      }
    }

    const viewModel: IGameViewModel = {
      cells: cells,
    };
    this.subject.next(viewModel);
  }

  private getCellFromCells(cells: Array<Array<ICell>>, { x, y }: IVector) {
    return cells[x] && cells[x][y] ? cells[x][y] : null;
  }

  public reveal(vector: IVector) {
    const cells = this.subject.getValue().cells;
    const cell = this.getCellFromCells(cells, vector);
    //GEt
    //TODO in mutator:
    cell.state = CellState.revealed;
    if (cell.value === -1) {
      alert('Game over');
    }
    if (cell.value === 0) {
      cell.neighbors.forEach(neighbor => {
        if (neighbor) {
          this.reveal(neighbor);
        }
      });
    }
  }
}

function getVector(x: number, y: number) {
  return { x, y };
}
