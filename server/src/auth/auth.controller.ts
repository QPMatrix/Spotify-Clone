import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/auth/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Post('signup')
  async signup(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }
}
