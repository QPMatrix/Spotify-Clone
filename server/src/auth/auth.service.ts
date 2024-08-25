import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../dto/auth/login.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginData: LoginDto) {
    const user = await this.userService.findOne(loginData);
    const isMatchedPassword = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (isMatchedPassword) {
      delete user.password;
      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
