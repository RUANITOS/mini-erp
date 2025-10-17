import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
    constructor(private clientsService: ClientsService) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo cliente' })
    create(@Body() dto: CreateClientDto) {
        return this.clientsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar clientes' })
    findAll() {
        return this.clientsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar cliente por ID' })
    findOne(@Param('id') id: string) {
        return this.clientsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar cliente por ID' })
    update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
        return this.clientsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Arquivar/Excluir cliente por ID' })
    remove(@Param('id') id: string) {
        return this.clientsService.remove(id);
    }
}
