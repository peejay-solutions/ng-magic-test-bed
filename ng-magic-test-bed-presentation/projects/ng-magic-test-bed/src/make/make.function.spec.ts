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

    it('make(a, b) should support not conversion from object to array', () => {
        const a = {};
        const b = [];
        make(a, b);
        const itWorks = Array.isArray(a);
        expect(itWorks).toBeFalsy();
    });

    it('make(a, b) should support not functions', () => {
        const a = {};
        const b = () => 100;
        make(a, b);
        expect(() => {
            expect((a as any)()).not.toEqual(100);
        }).toThrow();
    });

    it('make(a, b) should support not strings', () => {
        const a = {};
        const b = 'string';
        make(a, b);
        expect(() => {
            expect(a).not.toEqual(b);
        }).toThrow();
    });

    it('make(a, b) should support not Maps', () => {
        const a: any = {};
        const b = new Map();
        b.set('a', 100);
        make(a, b);
        expect(() => {
            expect((<Map<string, number>>a).get('a')).not.toEqual(100);
        }).toThrow();
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
