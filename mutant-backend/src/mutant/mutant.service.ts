import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { DnaRecord } from './entities/dna-record.entity';
import { DnaStatus, EXISTS_HUMAN, EXISTS_MUTANT, HUMAN, MUTANT } from './interfaces/dna-status.interface';
import { isMutant } from './mutant-analyzer';


@Injectable()
export class MutantService {
    constructor(
        @InjectRepository(DnaRecord) private readonly repo: Repository<DnaRecord>,
        private readonly redis: RedisService,
    ) { }

    async checkAndSaveDna(dna: string[]): Promise<{ status: DnaStatus; message: string }> {
        const sequence = JSON.stringify(dna);
        const cacheKey = `dna:${sequence}`;

        const cached = await this.redis.get(cacheKey);
        if (cached) {
            return { status: cached as DnaStatus, message: 'From cache' };
        }

        const existing = await this.repo.findOneBy({ sequence });
        if (existing) {
            const result = existing.isMutant ? EXISTS_MUTANT : EXISTS_HUMAN;
            await this.redis.set(cacheKey, result);
            return { status: result, message: 'From database' };
        }

        const mutant = isMutant(dna);
        const status = mutant ? MUTANT : HUMAN;

        await this.repo.save(this.repo.create({ sequence, isMutant: mutant }));
        await this.redis.set(cacheKey, status);

        return { status, message: 'Analyzed and stored' };
    }

    async getStats() {
        const cached = await this.redis.get('stats');
        if (cached) return JSON.parse(cached);

        const [mutants, humans] = await Promise.all([
            this.repo.count({ where: { isMutant: true } }),
            this.repo.count({ where: { isMutant: false } }),
        ]);

        const ratio = humans === 0 ? 0 : parseFloat((mutants / humans).toFixed(2));
        const stats = { count_mutant_dna: mutants, count_human_dna: humans, ratio };

        await this.redis.set('stats', JSON.stringify(stats), 5);
        return stats;
    }
}
