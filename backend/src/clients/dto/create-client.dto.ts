import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  puntos_fidelidad?: number;
}
