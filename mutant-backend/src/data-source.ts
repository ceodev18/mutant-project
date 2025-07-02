import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { DnaRecord } from './mutant/entities/dna-record.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [DnaRecord],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
