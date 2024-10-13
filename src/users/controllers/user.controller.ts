import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
  UseGuards,
  Param,
  NotFoundException,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/uploads/uploads.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly uploadService: UploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('store')
  @UseInterceptors(FileInterceptor('photo')) // 'photo' adalah nama field untuk file upload
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let photoUrl = null;

      // upload ke ImageKit
      if (file) {
        const uploadResult = await this.uploadService.uploadFile(file);
        photoUrl = uploadResult.url;
      }

      // save to db
      await this.userService.create(createUserDto, photoUrl);

      return {
        status: 201,
        message: `User ${createUserDto.name} berhasil ditambahkan`,
      };
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Failed to add data');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('show/:id')
  async show(@Param('id') id: string) {
    try {
      const user = await this.userService.findOneById(id);

      return {
        status: 200,
        data: user,
      };
    } catch (error) {
      throw new NotFoundException(`User not found`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('role')
  findAllRoles() {
    return this.roleService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('role')
  async createRole(@Body() roleData: any) {
    return this.roleService.create(roleData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    const id = req.user.id;
    const user = await this.userService.findOneById(id);

    return {
      status: 200,
      data: user,
    };
  }
}
