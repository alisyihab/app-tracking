import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingModule } from './tracking/tracking.module';
import { AppDataSource, mongoUri } from 'ormconfig';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options), // Koneksi ke PostgreSQL
    MongooseModule.forRoot(mongoUri), // Koneksi ke MongoDB
    TrackingModule, AuthModule, UserModule,
  ],
})
export class AppModule {}
