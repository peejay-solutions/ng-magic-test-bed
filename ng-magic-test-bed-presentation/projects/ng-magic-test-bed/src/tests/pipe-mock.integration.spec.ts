import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { NgMagicTestBed } from '../public-api';

// Covers pipeMock(pipeName, transform?)
// Generates a throwaway standalone pipe with the given name and registers it
// for the fixture. Returns the spy behind its transform() method directly.

@Pipe({
    name: 'currencyFormat', 
})
class CurrencyFormatPipe{
    transform(value: number){
        return `${value}€`
    }
}

@Component({
    selector: 'currency-host',
    standalone: true,
    imports: [CurrencyFormatPipe],
    template: `{{ amount | currencyFormat }}`,
})
class CurrencyHostComponent {
    @Input() public amount = 0;
}

describe('pipeMock()', () => {

    it('without a transform should pass the input value through unchanged (identity)', () => {
        const magic = new NgMagicTestBed();
        magic.pipeMock('currencyFormat');

        const fixture = magic.fixture(CurrencyHostComponent, { amount: 42 });

        expect(fixture.nativeElement.textContent.trim()).toBe('42');
    });

    it('with a custom transform should use it to compute the output', () => {
        const magic = new NgMagicTestBed();
        magic.pipeMock('currencyFormat', (value: number) => `$${value}`);

        const fixture = magic.fixture(CurrencyHostComponent, { amount: 42 });

        expect(fixture.nativeElement.textContent.trim()).toBe('$42');
    });

    it('returns a spy that records every call the template makes to the pipe', () => {
        const magic = new NgMagicTestBed();
        const currencyFormatSpy = magic.pipeMock('currencyFormat', (value: number) => `$${value}`);

        magic.fixture(CurrencyHostComponent, { amount: 42 });

        expect(currencyFormatSpy).toHaveBeenCalledWith(42);
    });

    it('should throw when called without a pipe name', () => {
        const magic = new NgMagicTestBed();

        expect(() => magic.pipeMock('')).toThrowError('pipeName has to be defined');
    });

});

describe('keptPipe() - keeping the REAL pipe', () => {

    @Pipe({ name: 'shout', standalone: true })
    class ShoutPipe implements PipeTransform {
        public transform(value: string): string {
            return `${value.toUpperCase()}!`;
        }
    }

    @Component({
        selector: 'shout-host',
        standalone: true,
        imports: [ShoutPipe],
        template: `{{ text | shout }}`,
    })
    class ShoutHostComponent {
        @Input() public text = '';
    }

    it('should keep the real transform() logic, not replace it with a spy', () => {
        const magic = new NgMagicTestBed();
        magic.keptPipe(ShoutPipe);

        const fixture = magic.fixture(ShoutHostComponent, { text: 'hello' });

        expect(fixture.nativeElement.textContent.trim()).toBe('HELLO!');
    });

});
