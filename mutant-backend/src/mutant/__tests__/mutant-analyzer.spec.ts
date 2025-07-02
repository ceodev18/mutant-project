import { isMutant } from '../mutant-analyzer';

describe('isMutant', () => {
    it('should return true for a mutant DNA (horizontal sequence)', () => {
        const dna = [
            'ATGCGA',
            'CAGTGC',
            'TTATGT',
            'AGAAGG',
            'CCCCTA',
            'TCACTG',
        ];
        expect(isMutant(dna)).toBe(true);
    });

    it('should return false for a human DNA', () => {
        const dna = [
            'ATGCGA',
            'CAGTGC',
            'TTATTT',
            'AGACGG',
            'GCGTCA',
            'TCACTG',
        ];
        expect(isMutant(dna)).toBe(false);
    });

    it('should return true for a mutant DNA (diagonal ↘)', () => {
        const dna = [
            'ATGCGA',
            'CAGTAC',
            'TTAAGT',
            'AGAAAG',
            'CGCATA',
            'TCACTG',
        ];
        expect(isMutant(dna)).toBe(true);
    });

    it('should return true for a mutant DNA (vertical ↓)', () => {
        const dna = [
            'ATGCGA',
            'ATGTGC',
            'ATATGT',
            'ATAAGG',
            'ACCCTA',
            'TCACTG',
        ];
        expect(isMutant(dna)).toBe(true);
    });
});
