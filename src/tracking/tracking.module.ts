import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingService } from './services/tracking.service';
import { TrackingController } from './controllers/tracking.controller';
import { PgTracking } from './entities/tracking.entity'; // PostgreSQL entity
import { TrackingSchema } from './schemas/tracking.schema'; // MongoDB schema
import { TrackingGateway } from './tracking.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([PgTracking]), // PostgreSQL
    MongooseModule.forFeature([{ name: 'Tracking', schema: TrackingSchema }]), // MongoDB
  ],
  providers: [TrackingService, TrackingGateway],
  controllers: [TrackingController],
})
export class TrackingModule {}
