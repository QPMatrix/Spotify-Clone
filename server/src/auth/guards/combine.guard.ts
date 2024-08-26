import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // First, try JWT authentication
    try {
      const jwtAuthResult = await this.jwtAuthGuard.canActivate(context);
      if (jwtAuthResult) return true;
    } catch (err) {
      console.log(err);
      const apiKey = request.headers['x-api-key'];
      if (apiKey) {
        const user = await this.authService.validateApiKey(apiKey);
        if (user) {
          request.user = user;
          return true;
        }
      }
    }

    return false;
  }
}
