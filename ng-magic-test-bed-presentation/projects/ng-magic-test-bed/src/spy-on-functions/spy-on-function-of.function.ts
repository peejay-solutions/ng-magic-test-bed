
export function spyOnFunctionOf(target: any, key: string) {
    if (jasmine.isSpy(target[key])){
        return;
    }
    if (!target[key]){
        target[key] = () => {};
    }
    spyOn(target, key).and.callThrough();
}
