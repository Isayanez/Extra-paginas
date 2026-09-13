import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import { Product } from '../../products/entities/product.entity.js';
import { Order } from './order.entity.js';

@Entity('detalle_pedidos')
export class OrderDetail {
  @PrimaryColumn({
    type: 'int',
    name: 'pedido_id',
  })
  pedido_id: number;

  @PrimaryColumn({
    type: 'int',
    name: 'producto_id',
  })
  producto_id: number;

  @Column({
    type: 'int',
  })
  cantidad: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precio_unitario: number;

  @ManyToOne(() => Order, (order) => order.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pedido_id' })
  order: Relation<Order>;

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'producto_id' })
  producto: Relation<Product>;
}