import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DnaRecord } from 'src/mutant/entities/dna-record.entity';

export const typeOrmConfig = async (
    configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
    console.log('[TypeORM Config] Loading environment variables...');
    const dbHost = configService.get<string>('DB_HOST');
    const dbPort = configService.get<string>('DB_PORT');
    const dbUser = configService.get<string>('DB_USER');
    const dbName = configService.get<string>('DB_NAME');
    const dbPassword = configService.get<string>('DB_PASSWORD');

    if (!dbPassword) {
        throw new Error('DB_PASSWORD is not set in environment variables');
    }

    return {
        type: 'postgres',
        host: dbHost ?? 'localhost',
        port: parseInt(dbPort ?? '5432'),
        username: dbUser ?? 'postgres',
        password: dbPassword,
        database: dbName ?? 'mutantdb',
        entities: [DnaRecord],
        synchronize: false,
        logging: false,
    };
};
