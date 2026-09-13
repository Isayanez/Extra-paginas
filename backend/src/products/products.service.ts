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
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);

      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(
        `Producto con id ${id} no encontrado`,
      );
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    this.productRepository.merge(product, updateProductDto);

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const product = await this.findOne(id);

    try {
      await this.productRepository.remove(product);

      return {
        message: `Producto con id ${id} eliminado correctamente`,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    // No exponer detalles internos (sqlMessage, stack) al cliente
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