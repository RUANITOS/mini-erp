import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionStatus } from './transaction.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) { }

    @Post()
    @ApiOperation({ summary: 'Criar nova transação' })
    create(@Body() dto: CreateTransactionDto) {
        return this.transactionsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar transações com filtros' })
    @ApiQuery({ name: 'kind', enum: ['PAYABLE', 'RECEIVABLE'], required: false })
    @ApiQuery({ name: 'status', enum: ['PENDING', 'PAID'], required: false })
    @ApiQuery({ name: 'clientId', required: false })
    @ApiQuery({ name: 'from', required: false })
    @ApiQuery({ name: 'to', required: false })
    findAll(
        @Query('kind') kind?: string,
        @Query('status') status?: string,
        @Query('clientId') clientId?: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        const statusEnum = status ? (TransactionStatus[status as keyof typeof TransactionStatus] ?? undefined) : undefined;
        return this.transactionsService.findAll({ kind, status: statusEnum, clientId, from, to });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar transação por ID' })
    findOne(@Param('id') id: string) {
        return this.transactionsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar transação' })
    update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
        return this.transactionsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover transação' })
    remove(@Param('id') id: string) {
        return this.transactionsService.remove(id);
    }

    @Post(':id/pay')
    @ApiOperation({ summary: 'Quitar transação' })
    pay(@Param('id') id: string) {
        return this.transactionsService.pay(id);
    }
}
