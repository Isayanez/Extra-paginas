import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDetailDto {
  @IsInt()
  @IsPositive()
  producto_id: number;

  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_unitario: number;
}
