import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/auth/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { ValidateTokenDto } from '../dto/auth/validate-token.dto';
import { EnableTwoFactorAuthPayload } from '../types/Payload';
import { UpdateResult } from 'typeorm';
import { ApiKeyStrategy } from './strategies/api-key.strategy';

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
  async login(
    @Body() loginData: LoginDto,
  ): Promise<{ accessToken: string } | { message: string }> {
    return this.authService.login(loginData);
  }
  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enableTwoFactorAuth(
    @Req() req: Request,
  ): Promise<EnableTwoFactorAuthPayload> {
    return this.authService.enableTwoFactorAuth(req.user.userId);
  }
  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validateTwoFactorAuth(
    @Req() req: Request,
    @Body() data: ValidateTokenDto,
  ): Promise<{ verified: boolean }> {
    return this.authService.validateTwoFactorAuth(req.user.userId, data);
  }
  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disableTwoFactorAuth(@Req() req: Request): Promise<UpdateResult> {
    return this.authService.disableTwoFactorAuth(req.user.userId);
  }
  @Get('generate-api-key')
  @UseGuards(JwtAuthGuard)
  generateAPIKey(@Req() req: Request): Promise<{ apiKey: string }> {
    return this.userService.generateAPIKey(req.user.userId);
  }
  @Delete('delete-api-key')
  @UseGuards(ApiKeyStrategy)
  deleteAPIKey(@Req() req: Request): Promise<UpdateResult> {
    return this.userService.deleteAPIKey(req.user.userId);
  }
}
