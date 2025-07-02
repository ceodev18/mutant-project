import { Body, Controller, ForbiddenException, Get, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckDnaDto } from './dto/check-dna.dto';
import { MutantService } from './mutant.service';

@ApiTags('mutant')
@Controller('mutant')
export class MutantController {
    constructor(private readonly mutantService: MutantService) { }

    @Post()
    @ApiBody({ type: CheckDnaDto })
    @ApiResponse({ status: 200, description: 'Mutant DNA detected' })
    @ApiResponse({ status: 403, description: 'Human DNA (not mutant)' })
    @ApiResponse({ status: 400, description: 'Invalid input format' })
    async checkMutant(@Body() body: CheckDnaDto) {
        const result = await this.mutantService.checkAndSaveDna(body.dna);
        if (result.status === 'human') {
            throw new ForbiddenException(result.message);
        }
        return result;
    }

    @Get('stats')
    @ApiResponse({ status: 200, description: 'Mutant vs Human DNA statistics' })
    async getStats() {
        return this.mutantService.getStats();
    }
}
