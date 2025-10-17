import { IsString, IsNumber, IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { TransactionKind, TransactionStatus } from '../transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
    @IsUUID()
    clientId: string;

    @ApiProperty({ example: 'Cliente XYZ' })
    @IsString()
    description: string;

    @ApiProperty({ example: 100.5 })
    @IsNumber()
    amount: number;

    @ApiProperty({ enum: TransactionKind })
    @IsEnum(TransactionKind)
    kind: TransactionKind;

    @ApiProperty({ example: '2025-10-20' })
    @IsDateString()
    dueDate: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(TransactionStatus)
    status?: TransactionStatus;
}
