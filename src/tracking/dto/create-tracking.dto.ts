import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackingDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsNotEmpty()
  timestamp: Date;
}
