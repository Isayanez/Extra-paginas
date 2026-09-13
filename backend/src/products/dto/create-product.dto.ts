import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  precio: number;

  @IsInt()
  @Min(0)
  stock: number;
}