import { TestBed } from '@angular/core/testing';
import { IdGeneratorService } from './id-generator.service';

describe('IdGeneratorService(standard)', () => {
    let idGeneratorService: IdGeneratorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        idGeneratorService = TestBed.inject(IdGeneratorService);
    });

    it('generate() should return a non-empty id', () => {
        const id = idGeneratorService.generate();

        expect(id).toBeTruthy();
    });

    it('generate() should return a different id on every call', () => {
        const first = idGeneratorService.generate();
        const second = idGeneratorService.generate();

        expect(first).not.toEqual(second);
    });
});
