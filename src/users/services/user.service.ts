import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/database/entities/users/user.entity';
import { Role } from 'src/database/entities/roles/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    roleId?: number,
  ): Promise<{ data: any[]; total: number }> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.id AS id',
        'user.name',
        'user.username',
        'user.email',
        'role.name AS role',
      ])
      .where(
        'user.name LIKE :search OR user.username LIKE :search OR user.email LIKE :search',
        { search: `%${search}%` },
      );

    // Filter berdasarkan role jika roleId diberikan
    if (roleId) {
      query.andWhere('role.id = :roleId', { roleId });
    }

    // Menghitung total jumlah data yang sesuai dengan kondisi pencarian dan filter
    const total = await query.getCount();

    // Pagination
    const data = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    return { data, total };
  }

  findByUsernameOrEmail(credential: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ username: credential }, { email: credential }],
      relations: ['role'],
    });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = userData.name;
    user.email = userData.email;
    user.username = userData.username;
    user.password = await bcrypt.hash(userData.password, 10);

    // Cari role berdasarkan ID yang dikirim dalam payload
    const role = await this.roleRepository.findOne({
      where: { id: userData.roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    user.role = role;

    return this.userRepository.save(user);
  }
}
