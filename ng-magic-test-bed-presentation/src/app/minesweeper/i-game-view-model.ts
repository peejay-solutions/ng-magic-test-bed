export interface IGameViewModel {
    cells: Array<Array<ICell>>;
}

export interface IVector {
    x: number;
    y: number;
}

export interface ICell {
    neighbors: Array<IVector | null>;
    state: CellState;
    value: number;
    vector: IVector;
}

export enum CellState {
    revealed, marked, hidden
}
