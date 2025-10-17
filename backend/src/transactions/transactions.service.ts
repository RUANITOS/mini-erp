import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionStatus } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepo: Repository<Transaction>,
  ) {}

  create(dto: CreateTransactionDto) {
    const tx = this.transactionsRepo.create(dto);
    return this.transactionsRepo.save(tx);
  }

  findAll(filters?: {
    kind?: string;
    status?: TransactionStatus;
    clientId?: string;
    from?: string;
    to?: string;
  }) {
    const where: any = {};

    if (filters?.kind) where.kind = filters.kind;
    if (filters?.status) where.status = filters.status;
    if (filters?.clientId) where.clientId = filters.clientId;
    if (filters?.from && filters?.to) where.dueDate = Between(filters.from, filters.to);

    return this.transactionsRepo.find({ where, relations: ['client'], order: { dueDate: 'ASC' } });
  }

  async findOne(id: string) {
    const tx = await this.transactionsRepo.findOne({ where: { id }, relations: ['client'] });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const tx = await this.findOne(id);
    Object.assign(tx, dto);
    return this.transactionsRepo.save(tx);
  }

  async remove(id: string) {
    const tx = await this.findOne(id);
    return this.transactionsRepo.remove(tx);
  }

  async pay(id: string) {
    const tx = await this.findOne(id);
    tx.status = TransactionStatus.PAID;
    tx.paidDate = new Date().toISOString().slice(0, 10);
    return this.transactionsRepo.save(tx);
  }
}
