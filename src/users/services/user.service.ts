import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { User } from 'src/database/entities/users/user.entity';
import { Role } from 'src/database/entities/roles/role.entity';
import { UserDto } from '../dto/response/userDto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { UploadService } from 'src/uploads/uploads.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private uploadService: UploadService,
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
        'user.name as name',
        'user.username as username',
        'user.email as email',
        'role.name AS role',
        'user.created_at as created_at',
      ])
      .where(
        'user.name LIKE :search OR user.username LIKE :search OR user.email LIKE :search',
        { search: `%${search}%` },
      )
      .orderBy('created_at', 'DESC');

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

  async findOneById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const userDto = new UserDto();

    userDto.id = user.id;
    userDto.name = user.name;
    userDto.username = user.username;
    userDto.email = user.email;
    userDto.photo = user.photo;
    userDto.role = user.role.name;
    userDto.created_at = user.created_at;
    userDto.roleId = user.role.id;

    return userDto;
  }

  async create(
    userData: CreateUserDto,
    photoUrl: string,
    photoId: string,
  ): Promise<User> {
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

    // Jika photo URL tersedia, simpan ke entitas user
    if (photoUrl) {
      user.photo = photoUrl;
      user.photoFileId = photoId;
    }

    return this.userRepository.save(user);
  }

  async updateUser(
    userId: string,
    userData: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cek apakah email yang dikirimkan berbeda dari yang ada di database
    if (userData.email !== user.email) {
      // Cek apakah email sudah digunakan oleh pengguna lain
      const emailExists = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (emailExists) {
        throw new BadRequestException('Email already in use by another user');
      }
      user.email = userData.email;
    }

    // Perbarui data lain pengguna jika ada
    if (userData.name) user.name = userData.name;
    if (userData.username) user.username = userData.username;
    if (userData.password) {
      user.password = await bcrypt.hash(userData.password, 10);
    }

    // Jika file gambar di-upload, cek ukuran file dan upload ke ImageKit
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5 MB limit
        throw new BadRequestException('File size exceeds 5 MB');
      }

      // Jika pengguna sudah memiliki gambar sebelumnya, hapus gambar lama di ImageKit
      if (user.photoFileId) {
        await this.uploadService.deleteFile(user.photoFileId);
      }

      // Upload gambar baru ke ImageKit
      const uploadResult = await this.uploadService.uploadFile(file);
      user.photo = uploadResult.url;
      user.photoFileId = uploadResult.fileId;
    }

    await this.userRepository.save(user);

    return `User ${user.name} berhasil diubah`;
  }
}
