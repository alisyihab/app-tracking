import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from '../services/vehicles.service';
import { JwtAuthGuard } from 'src/auth/utils/jwt.guard';
import { CreateVehicleDto } from '../dto/request/create-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getVehicles(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    const result = await this.vehicleService.findAll(page, limit, search);

    return {
      status: 200,
      data: result.data,
      total: result.total,
      currentPage: page,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('store')
  async createVehicle(@Body() createVehicle: CreateVehicleDto) {
    try {
      await this.vehicleService.create(createVehicle);

      return {
        status: 201,
        message: `Kendaraan ${createVehicle.name} berhasil ditambahkan`,
      };
    } catch (error) {
      throw new BadRequestException('failed to add data');
    }
  }

  @Get(':id')
  async findVehicle(@Param('id') id: number) {
    const data = await this.vehicleService.findOneById(id);

    return {
      status: 200,
      data: data,
    };
  }
}
