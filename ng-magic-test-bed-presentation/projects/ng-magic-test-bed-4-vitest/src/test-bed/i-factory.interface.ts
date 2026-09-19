export interface IFactory<I> {
    create(...args: Array<any>): I;
}
