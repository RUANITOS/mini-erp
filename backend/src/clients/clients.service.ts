import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  create(dto: CreateClientDto) {
    const client = this.clientsRepository.create(dto);
    return this.clientsRepository.save(client);
  }

  findAll() {
    return this.clientsRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const client = await this.clientsRepository.findOne({ where: { id, isActive: true } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    client.isActive = false;
    return this.clientsRepository.save(client);
  }
}
