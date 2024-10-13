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
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/uploads/uploads.service';
import { UpdateUserDto } from '../dto/request/update-user.dto';

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
      let photoUrl = null,
        photoId = null;

      // upload ke ImageKit
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          throw new BadRequestException('File size exceeds 5 MB');
        }

        const uploadResult = await this.uploadService.uploadFile(file);
        photoUrl = uploadResult.url;
        photoId = uploadResult.fileId;
      }

      // save to db
      await this.userService.create(createUserDto, photoUrl, photoId);

      return {
        status: 201,
        message: `User ${createUserDto.name} berhasil ditambahkan`,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to add data');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const updateUser = await this.userService.updateUser(id, updateUserDto, file);

      return {
        status: 200,
        message: updateUser,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to update data');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('edit/:id')
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

    delete user.roleId;

    return {
      status: 200,
      data: user,
    };
  }
}
