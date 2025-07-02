import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDNATable1751405312574 implements MigrationInterface {
    name = 'CreateDNATable1751405312574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dna_record" ("id" SERIAL NOT NULL, "sequence" text NOT NULL, "isMutant" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d041f007e55f5197792ddf798c7" UNIQUE ("sequence"), CONSTRAINT "PK_7d15a8ea51aedc2a665254b7e07" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dna_record"`);
    }

}
