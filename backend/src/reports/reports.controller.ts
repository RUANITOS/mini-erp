import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CashflowReportDto } from './dto/cashflow-report.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import * as json2csv from 'json2csv';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @ApiTags('Reports')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)

    @Get('cashflow')
    @ApiOperation({ summary: 'Relatório de fluxo de caixa' })
    @ApiQuery({ name: 'from', required: true })
    @ApiQuery({ name: 'to', required: true })
    @ApiQuery({ name: 'export', enum: ['json', 'csv'], required: false })
    async getCashflow(
        @Query() query: CashflowReportDto & { format?: 'json' | 'csv' },
        @Res() res: Response
    ) {
        const report = await this.reportsService.getCashflow(query);

        if (query.format === 'csv') {
            const fields = ['date', 'in', 'out'];
            const opts = { fields };
            const parser = new json2csv.Parser(opts);
            const csv = parser.parse(report.timeline);

            res.header('Content-Type', 'text/csv');
            res.attachment(`cashflow_${report.period.from}_to_${report.period.to}.csv`);
            return res.send(csv);
        }

        return res.json(report);
    }
}
