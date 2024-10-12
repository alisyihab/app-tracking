import { IsNotEmpty, IsString, IsEmail, IsInt } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  noPol: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}