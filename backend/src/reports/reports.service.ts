import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transaction } from 'src/transactions/transaction.entity';
import { CashflowReportDto } from './dto/cashflow-report.dto';

@Injectable()
export class ReportsService {
    constructor(private dataSource: DataSource) { }

    async getCashflow({ from, to }: CashflowReportDto) {
        const repo = this.dataSource.getRepository(Transaction);

        // Buscar transações no período
        const transactions = await repo
            .createQueryBuilder('t')
            .where('t.dueDate BETWEEN :from AND :to', { from, to })
            .getMany();

        // Totais
        const totalReceived = transactions
            .filter(t => t.kind === 'RECEIVABLE' && t.status === 'PAID')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalPaid = transactions
            .filter(t => t.kind === 'PAYABLE' && t.status === 'PAID')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const balance = totalReceived - totalPaid;

        // Linha do tempo diária
        const timelineMap = new Map<string, { in: number; out: number }>();
        transactions.forEach(t => {
            const dueDate = new Date(t.dueDate);
            const date = dueDate.toISOString().slice(0, 10);
            if (!timelineMap.has(date)) timelineMap.set(date, { in: 0, out: 0 });

            const day = timelineMap.get(date)!;
            if (t.kind === 'RECEIVABLE') day.in += t.status === 'PAID' ? Number(t.amount) : 0;
            if (t.kind === 'PAYABLE') day.out += t.status === 'PAID' ? Number(t.amount) : 0;
        });

        const timeline = Array.from(timelineMap.entries()).map(([date, data]) => ({
            date,
            in: data.in.toFixed(2),
            out: data.out.toFixed(2),
        }));

        return {
            period: { from, to },
            totals: {
                received: totalReceived.toFixed(2),
                paid: totalPaid.toFixed(2),
                balance: balance.toFixed(2),
            },
            timeline,
        };
    }
}
