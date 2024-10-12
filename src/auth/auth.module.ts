import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './utils/jwt.strategy';
import * as dotenv from 'dotenv';
import { UserService } from 'src/users/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { User } from 'src/database/entities/users/user.entity';
import { Role } from 'src/database/entities/roles/role.entity';

// Load environment variables from .env file
dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule
  ],
  providers: [AuthService, JwtStrategy, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
