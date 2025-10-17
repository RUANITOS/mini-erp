import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CashflowReportDto {
    @ApiProperty({ example: '2025-10-01' })
    @IsDateString()
    from: string;

    @ApiProperty({ example: '2025-10-31' })
    @IsDateString()
    to: string;
}
