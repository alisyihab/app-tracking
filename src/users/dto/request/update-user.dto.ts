import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsInt,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  roleId: number;
}
