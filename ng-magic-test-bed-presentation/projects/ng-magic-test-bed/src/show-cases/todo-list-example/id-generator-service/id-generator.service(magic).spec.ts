import { NgMagicSetupTestBed } from '../../../public-api';
import { IdGeneratorService } from './id-generator.service';

describe('IdGeneratorService(magic)', () => {

    function setup() {
        const magic = new NgMagicSetupTestBed();
        // No dependencies to mock at all - injection() is enough on its own.
        const idGeneratorService = magic.injection(IdGeneratorService);
        return { idGeneratorService };
    }

    it('generate() should return a non-empty id', () => {
        const { idGeneratorService } = setup();

        const id = idGeneratorService.generate();

        expect(id).toBeTruthy();
    });

    it('generate() should return a different id on every call', () => {
        const { idGeneratorService } = setup();

        const first = idGeneratorService.generate();
        const second = idGeneratorService.generate();

        expect(first).not.toEqual(second);
    });

});
