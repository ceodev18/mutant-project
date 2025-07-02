import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DnaRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { unique: true })
    sequence: string;

    @Column({ type: 'boolean' })
    isMutant: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
