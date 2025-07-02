import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';
import { DnaRecord } from './entities/dna-record.entity';
import { MutantController } from './mutant.controller';
import { MutantService } from './mutant.service';

@Module({
  imports: [TypeOrmModule.forFeature([DnaRecord])],
  controllers: [MutantController],
  providers: [MutantService, RedisService],
})
export class MutantModule { }
