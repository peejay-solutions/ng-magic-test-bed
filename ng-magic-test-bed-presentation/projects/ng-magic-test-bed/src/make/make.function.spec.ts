import { make } from './make.function';

describe('make(a:anyObject, b:anyObject', () => {

    it('make(a, b) should make a to b without changing the reference', () => {
        const a = new B();
        const b = new D();
        make(a, b);
        expect((<D><any>a).doC()).toEqual('C');
        expect((<D><any>a).value1).toEqual('C');
        expect((<D><any>a).value2).toEqual('D');
        expect((<D><any>a).doD()).toEqual('D');
    });

});

class A {
    public value1 = 'A';
    private valueA = 'A';
    doA() {
        return this.valueA;
    }
}

class B extends A {
    public value2 = 'B';
    private valueB = 'B';
    doB() {
        return this.valueB;
    }
}

class C {
    public value1 = 'C';
    private valueC = 'C';
    doC() {
        return this.valueC;
    }
}

class D extends C {
    public value2 = 'D';
    private valueD = 'D';
    doD() {
        return this.valueD;
    }
}
