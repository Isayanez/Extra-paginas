import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'fullName',
  })
  fullName: string;

  @Column({
    type: 'tinyint',
    default: 1,
    name: 'isActive',
  })
  isActive: boolean;

  @Column({
    type: 'longtext',
    transformer: {
      to: (value: string[]) => JSON.stringify(value),

      from: (value: unknown): string[] => {
        if (Array.isArray(value)) {
          return value.map(String);
        }

        if (typeof value === 'string') {
          try {
            const parsed: unknown = JSON.parse(value);

            return Array.isArray(parsed)
              ? parsed.map(String)
              : [];
          } catch {
            return value ? [value] : [];
          }
        }

        return [];
      },
    },
  })
  roles: string[];

  @Column({
    type: 'int',
    unique: true,
    name: 'empleado_id',
  })
  empleado_id: number;
}