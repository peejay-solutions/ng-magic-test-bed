import { Injectable } from "@angular/core";
import { HelperService } from "./helper.service";

@Injectable({
    providedIn: 'root'
})
export class ExampleService {
    constructor(private helperService: HelperService) {
    }

    public doSomething(param: number) {
        const data = this.helperService.getData(param);
        this.helperService.doSomething(data.value);
    }
}
