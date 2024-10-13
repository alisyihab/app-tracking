import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './services/role.service';
import { User } from 'src/database/entities/users/user.entity';
import { Role } from 'src/database/entities/roles/role.entity';
import { UploadService } from 'src/uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserService, RoleService, UploadService],
  controllers: [UserController],
})
export class UserModule {}
