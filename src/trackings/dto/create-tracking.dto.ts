import { IsUUID, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateTrackingDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  vehicleId: number;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsNotEmpty()
  timestamp: Date;

}
