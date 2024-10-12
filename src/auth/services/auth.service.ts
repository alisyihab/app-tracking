import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDto } from 'src/users/dto/response/userDto';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    credential: string,
    pass: string,
  ): Promise<UserDto> {
    const user = await this.userService.findByUsernameOrEmail(credential);

    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const userDto = new UserDto();

      userDto.id = user.id;
      userDto.name = user.name;
      userDto.username = user.username;
      userDto.email = user.email;
      userDto.photo = user.photo;
      userDto.role = user.role.name;

      return userDto;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    return this.jwtService.sign(payload);
  }
}
