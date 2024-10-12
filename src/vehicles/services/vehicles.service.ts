import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from '../entities/vehicles.entitiy';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from '../dto/request/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicles) private vehicleRepository: Repository<Vehicles>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<{ data: any[]; total: number }> {
    const query = this.vehicleRepository
      .createQueryBuilder('vehicles')
      .select('vehicles.*')
      .where('vehicles.name LIKE :search OR vehicles.no_pol LIKE :search', {
        search: `%${search}%`,
      });

    const total = await query.getCount();

    const data = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    return { data, total };
  }

  async findOneById(id: number): Promise<Vehicles> {
    const vehicle = await this.vehicleRepository.findOneBy({ id });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async create(vehicleData: CreateVehicleDto): Promise<Vehicles> {
    const vehicle = new Vehicles();
    vehicle.name = vehicleData.name;
    vehicle.noPol = vehicleData.noPol;
    vehicle.type = vehicleData.type;

    return this.vehicleRepository.save(vehicle);
  }
}
