import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Get()
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('roleId') roleId?: number,
  ) {
    const result = await this.userService.findAll(page, limit, search, roleId);

    return {
      status: 200,
      data: result.data,
      total: result.total,
      currentPage: page,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  @Post('store')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
      return {
        status: 201,
        message: `User ${createUserDto.name} berhasil ditambahkan`,
      };
    } catch (error) {
      throw new BadRequestException('failed to add data');
    }
  }

  @Get('role')
  findAllRoles() {
    return this.roleService.findAll();
  }

  @Post('role')
  async createRole(@Body() roleData: any) {
    return this.roleService.create(roleData);
  }
}
