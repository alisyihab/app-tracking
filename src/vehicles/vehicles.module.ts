import { Module } from '@nestjs/common';
import { VehiclesController } from './controllers/vehicles.controller';
import { VehiclesService } from './services/vehicles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicles } from 'src/database/entities/vehicles/vehicles.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicles])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
