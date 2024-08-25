import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { User } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}
  @Post('signup')
  async signup(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }
}
