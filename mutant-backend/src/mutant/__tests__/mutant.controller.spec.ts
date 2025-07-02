import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MutantController } from '../mutant.controller';
import { MutantService } from '../mutant.service';

describe('MutantController', () => {
    let controller: MutantController;
    let service: MutantService;

    const mockService = {
        checkAndSaveDna: jest.fn(),
        getStats: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MutantController],
            providers: [
                { provide: MutantService, useValue: mockService },
            ],
        }).compile();

        controller = module.get(MutantController);
        service = module.get(MutantService);
        jest.clearAllMocks();
    });

    describe('POST /mutant', () => {
        it('should return 200 if mutant', async () => {
            const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
            mockService.checkAndSaveDna.mockResolvedValueOnce({ status: 'mutant', message: 'Analyzed' });

            const result = await controller.checkMutant({ dna });

            expect(result).toEqual({ status: 'mutant', message: 'Analyzed' });
            expect(mockService.checkAndSaveDna).toHaveBeenCalledWith(dna);
        });

        it('should throw 403 if human', async () => {
            const dna = ['ATGCGA', 'CAGTAC', 'TTATGT', 'AGAAGG', 'CCTCTA', 'TCACTG'];
            mockService.checkAndSaveDna.mockResolvedValueOnce({ status: 'human', message: 'Analyzed' });

            await expect(controller.checkMutant({ dna })).rejects.toThrow(ForbiddenException);
        });
    });

    describe('GET /stats', () => {
        it('should return stats', async () => {
            const stats = { count_mutant_dna: 40, count_human_dna: 100, ratio: 0.4 };
            mockService.getStats.mockResolvedValueOnce(stats);

            const result = await controller.getStats();

            expect(result).toEqual(stats);
            expect(mockService.getStats).toHaveBeenCalled();
        });
    });
});
