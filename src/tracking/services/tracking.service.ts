import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PgTracking } from '../entities/tracking.entity'; // PostgreSQL entity
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoTracking } from '../schemas/tracking.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(PgTracking)
    private trackingRepository: Repository<PgTracking>, // PostgreSQL repository

    @InjectModel('Tracking')
    private trackingModel: Model<MongoTracking>, // MongoDB model
  ) {}

  // Method untuk membuat tracking di PostgreSQL dan MongoDB
  async createTracking(trackingData: Partial<PgTracking>): Promise<PgTracking> {
    // Buat UUID baru untuk tracking
    const trackingId = uuidv4();

    // Simpan di MongoDB untuk real-time tracking
    const liveTracking = await this.trackingModel.create({
      ...trackingData,
      id: trackingId,
    });

    // Simpan di PostgreSQL
    const pgTracking = this.trackingRepository.create({
      ...trackingData,
      id: trackingId,
      status: 'ongoing',
    });
    await this.trackingRepository.save(pgTracking);

    return pgTracking;
  }

  async updateTrackingPosition(
    trackingId: string,
    positionData: Partial<PgTracking>,
  ): Promise<PgTracking> {
    // Update posisi di MongoDB
    const updatedLiveTracking = await this.trackingModel.findByIdAndUpdate(
      trackingId,
      { $set: positionData },
      { new: true },
    );

    // Update posisi dan status di PostgreSQL
    const pgTracking = await this.trackingRepository.findOneBy({
      id: trackingId,
    });

    if (pgTracking) {
      // Update field posisi
      pgTracking.latitude = positionData.latitude || pgTracking.latitude;
      pgTracking.longitude = positionData.longitude || pgTracking.longitude;

      // update status
      if (positionData.status) {
        pgTracking.status = positionData.status;
      }

      await this.trackingRepository.save(pgTracking);
    }

    return pgTracking;
  }

  // Method untuk mengambil semua tracking dari PostgreSQL
  async getAllTrackings(): Promise<PgTracking[]> {
    return await this.trackingRepository.find();
  }
}
