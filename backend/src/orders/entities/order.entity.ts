import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Client } from '../../clients/entities/client.entity.js';
import { OrderDetail } from './order-detail.entity.js';

@Entity('pedidos')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha: Date;

  @Column({
    type: 'int',
  })
  empleado_id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  cliente_id: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total: number;

  // Relación justificada: Client existe en src/clients/entities/client.entity.ts
  // empleado_id NO tiene entidad Empleado, se deja como columna simple
  @ManyToOne(() => Client, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Client | null;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  detalles: OrderDetail[];
}
