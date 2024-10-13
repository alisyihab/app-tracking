import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingModule } from './trackings/tracking.module';
import { AppDataSource, mongoUri } from 'ormconfig';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { UploadModule } from './uploads/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options), // Koneksi ke PostgreSQL
    MongooseModule.forRoot(mongoUri),
    TrackingModule,
    AuthModule,
    UserModule,
    VehiclesModule,
    UploadModule,
  ],
})
export class AppModule {}
