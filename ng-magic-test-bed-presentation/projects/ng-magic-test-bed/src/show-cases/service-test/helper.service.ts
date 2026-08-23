import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    private counter = 0;
    constructor() {
    }

    public doSomething(param: number) {
        this.counter = this.counter + param;
    }

    public getData(param: number) {
        return {
            value: param / 2
        };
    }
}
