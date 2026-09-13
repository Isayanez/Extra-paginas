import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dto/pagination.dto.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { Client } from './entities/client.entity.js';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    try {
      const client = this.clientRepository.create(createClientDto);

      return await this.clientRepository.save(client);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.clientRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);

    this.clientRepository.merge(client, updateClientDto);

    try {
      return await this.clientRepository.save(client);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const client = await this.findOne(id);

    try {
      await this.clientRepository.remove(client);

      return {
        message: `Cliente con id ${id} eliminado correctamente`,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    this.logger.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException(
        'Ya existe un registro con ese valor - entrada duplicada',
      );
    }

    if (
      error.code === 'ER_NO_REFERENCED_ROW_2' ||
      error.code === 'ER_ROW_IS_REFERENCED_2' ||
      error.code === 'ER_ROW_IS_REFERENCED'
    ) {
      throw new BadRequestException(
        'No se puede completar la operación por restricción de clave foránea',
      );
    }

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
