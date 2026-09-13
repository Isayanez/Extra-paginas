import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productos')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  nombre: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precio: number;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;
}