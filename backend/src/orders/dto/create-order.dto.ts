import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

import { CreateOrderDetailDto } from './create-order-detail.dto.js';

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  empleado_id: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  cliente_id?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  total?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  detalles?: CreateOrderDetailDto[];
}
