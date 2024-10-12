import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { TrackingService } from '../services/tracking.service';
import { PgTracking } from '../entities/tracking.entity';
import { CreateTrackingDto } from '../dto/create-tracking.dto';

@Controller('trackings')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  // Endpoint untuk membuat data tracking baru
  @Post()
  async create(
    @Body() createTrackingDto: CreateTrackingDto,
  ): Promise<PgTracking> {
    return this.trackingService.createTracking(createTrackingDto);
  }

  // Endpoint untuk mengambil semua data tracking
  @Get()
  async findAll(): Promise<PgTracking[]> {
    return this.trackingService.getAllTrackings();
  }

  @Patch(':id/position')
  async updatePosition(
    @Param('id') id: string,
    @Body() positionData: Partial<PgTracking>,
  ): Promise<PgTracking> {
    return this.trackingService.updateTrackingPosition(id, positionData);
  }
}
