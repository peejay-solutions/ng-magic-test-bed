
export function spyOnFunctionOf(target: any, key: string) {
    if (!target[key]){
        target[key] = () => {};
    }
    spyOn(target, key).and.callThrough();
}
