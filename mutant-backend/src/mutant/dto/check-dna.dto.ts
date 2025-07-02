import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, Length, Matches } from 'class-validator';

export class CheckDnaDto {
    @ApiProperty({
        description: 'DNA sequences in NxN format',
        example: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
        type: [String],
    })
    @IsArray()
    @ArrayMinSize(4)
    @Matches(/^[ACGT]+$/, { each: true })
    @Length(4, 100, { each: true })
    dna: string[];
}
