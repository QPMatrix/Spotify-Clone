import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ArtistsJwtGuard } from './auth/guards/artists-jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('protected')
  @UseGuards(ArtistsJwtGuard)
  getProtected(): string {
    return 'Protected route';
  }
}
