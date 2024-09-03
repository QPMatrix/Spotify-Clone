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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User account created successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async signup(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT access token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async login(
    @Body() loginData: LoginDto,
  ): Promise<{ accessToken: string } | { message: string }> {
    return this.authService.login(loginData);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enable Two-Factor Authentication (2FA)' })
  @ApiResponse({
    status: 200,
    description: '2FA enabled, returns the secret for 2FA setup',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  enableTwoFactorAuth(
    @Req() req,
  ): Promise<EnableTwoFactorAuthPayload> {
    return this.authService.enableTwoFactorAuth(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Validate Two-Factor Authentication (2FA) token' })
  @ApiResponse({
    status: 200,
    description: '2FA token validated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  validateTwoFactorAuth(
    @Req() req,
    @Body() data: ValidateTokenDto,
  ): Promise<{ verified: boolean }> {
    return this.authService.validateTwoFactorAuth(req.user.userId, data);
  }

  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Disable Two-Factor Authentication (2FA)' })
  @ApiResponse({
    status: 200,
    description: '2FA disabled successfully',
    type: UpdateResult,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  disableTwoFactorAuth(@Req() req): Promise<UpdateResult> {
    return this.authService.disableTwoFactorAuth(req.user.userId);
  }

  @Get('generate-api-key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generate an API key for the user' })
  @ApiResponse({
    status: 200,
    description: 'API key generated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  generateAPIKey(@Req() req): Promise<{ apiKey: string }> {
    return this.userService.generateAPIKey(req.user.userId);
  }

  @Delete('delete-api-key')
  @UseGuards(ApiKeyStrategy)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: "Delete the user's API key" })
  @ApiResponse({
    status: 200,
    description: 'API key deleted successfully',
    type: UpdateResult,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  deleteAPIKey(@Req() req): Promise<UpdateResult> {
    return this.userService.deleteAPIKey(req.user.userId);
  }
}
