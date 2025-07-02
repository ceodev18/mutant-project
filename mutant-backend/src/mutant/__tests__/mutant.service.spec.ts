import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../../redis/redis.service';
import { DnaRecord } from '../entities/dna-record.entity';
import { MutantService } from '../mutant.service';

describe('MutantService', () => {
    let service: MutantService;
    let repo: Repository<DnaRecord>;
    let redis: RedisService;

    const mockRepo = {
        findOneBy: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
    };

    const mockRedis = {
        get: jest.fn(),
        set: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MutantService,
                {
                    provide: getRepositoryToken(DnaRecord),
                    useValue: mockRepo,
                },
                {
                    provide: RedisService,
                    useValue: mockRedis,
                },
            ],
        }).compile();

        service = module.get(MutantService);
        repo = module.get(getRepositoryToken(DnaRecord));
        redis = module.get(RedisService);

        jest.clearAllMocks();
    });

    describe('checkAndSaveDna', () => {
        const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
        const sequence = JSON.stringify(dna);

        it('should return cached result if present', async () => {
            mockRedis.get.mockResolvedValueOnce('MUTANT');
            const result = await service.checkAndSaveDna(dna);
            expect(result.status).toBe('MUTANT');
            expect(result.message).toBe('From cache');
            expect(mockRedis.get).toHaveBeenCalledWith(`dna:${sequence}`);
        });

        it('should return DB result if found', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            mockRepo.findOneBy.mockResolvedValueOnce({ isMutant: true });
            const result = await service.checkAndSaveDna(dna);
            expect(result.status).toBe('exists_mutant');
            expect(result.message).toBe('From database');
            expect(mockRedis.set).toHaveBeenCalledWith(`dna:${sequence}`, 'exists_mutant');
        });

        it('should analyze and store new DNA (mutant)', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            mockRepo.findOneBy.mockResolvedValueOnce(null);
            mockRepo.create.mockReturnValueOnce({ sequence, isMutant: true });
            mockRepo.save.mockResolvedValueOnce({});
            const result = await service.checkAndSaveDna(dna);
            expect(result.status).toBe('mutant');
            expect(result.message).toBe('Analyzed and stored');
            expect(mockRepo.create).toHaveBeenCalledWith({ sequence, isMutant: true });
        });

        it('should analyze and store new DNA (human)', async () => {
            const humanDna = [
                'ATGCGA',
                'CAGTAC',
                'TTATGT',
                'AGAAGG',
                'CCTCTA',
                'TCACTG',
            ];
            const sequence = JSON.stringify(humanDna);

            mockRedis.get.mockResolvedValueOnce(null);
            mockRepo.findOneBy.mockResolvedValueOnce(null);
            mockRepo.create.mockReturnValueOnce({ sequence, isMutant: false });
            mockRepo.save.mockResolvedValueOnce({});
            const result = await service.checkAndSaveDna(humanDna);
            expect(result.status).toBe('human');
            expect(result.message).toBe('Analyzed and stored');
            expect(mockRepo.create).toHaveBeenCalledWith({ sequence, isMutant: false });
        });
    });

    describe('getStats', () => {
        it('should return cached stats', async () => {
            const cached = JSON.stringify({ count_mutant_dna: 10, count_human_dna: 5, ratio: 2 });
            mockRedis.get.mockResolvedValueOnce(cached);
            const result = await service.getStats();
            expect(result).toEqual(JSON.parse(cached));
        });

        it('should return stats from DB and cache them', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            mockRepo.count
                .mockResolvedValueOnce(40) // mutants
                .mockResolvedValueOnce(100); // humans

            const result = await service.getStats();
            expect(result).toEqual({
                count_mutant_dna: 40,
                count_human_dna: 100,
                ratio: 0.4,
            });

            expect(mockRedis.set).toHaveBeenCalledWith('stats', JSON.stringify(result), 5);
        });

        it('should handle division by zero', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            mockRepo.count.mockResolvedValueOnce(0); // mutants
            mockRepo.count.mockResolvedValueOnce(0); // humans

            const result = await service.getStats();
            expect(result.ratio).toBe(0);
        });
    });
});
