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
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { OrderDetail } from './entities/order-detail.entity.js';
import { Order } from './entities/order.entity.js';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { detalles, ...orderData } = createOrderDto;

    try {
      const total =
        detalles?.reduce(
          (sum, detalle) =>
            sum + detalle.cantidad * detalle.precio_unitario,
          0,
        ) ?? 0;

      const order = this.orderRepository.create({
        ...orderData,
        total,
      });

      const savedOrder = await this.orderRepository.save(order);

      if (detalles && detalles.length > 0) {
        const detailsToSave = detalles.map((detalle) =>
          this.orderDetailRepository.create({
            pedido_id: savedOrder.id,
            producto_id: detalle.producto_id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
          }),
        );

        await this.orderDetailRepository.save(detailsToSave);
      }

      return await this.findOne(savedOrder.id);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.orderRepository.find({
      relations: {
        cliente: true,
        detalles: {
          producto: true,
        },
      },
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        cliente: true,
        detalles: {
          producto: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    const { detalles, ...orderData } = updateOrderDto;

    if (detalles) {
      this.logger.warn(
        `Intento de actualizar detalles anidados en PATCH /orders/${id} ignorado`,
      );
    }

    this.orderRepository.merge(order, orderData);

    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    try {
      await this.orderRepository.remove(order);

      return {
        message: `Pedido con id ${id} eliminado correctamente`,
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
        'No se puede completar la operación por restricción de clave foránea - verifique cliente_id / producto_id',
      );
    }

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}