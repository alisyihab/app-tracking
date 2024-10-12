import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/database/entities/roles/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  create(roleData: any): Promise<Role> {
    const role = new Role();
    role.name = roleData.name;
    return this.roleRepository.save(role);
  }
}