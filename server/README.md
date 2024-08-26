<h1>📄 API Documentation</h1>

<h3>Overview</h3>
<p>This branch introduces the implementation of API Key-based authentication in the Spotify Clone backend. The API Key authentication provides an additional method for clients to authenticate with the backend, offering flexibility alongside JWT-based authentication. This section covers how API Key authentication was integrated, including the updates to the user entity, service methods, and authentication logic.</p>

<h3>1. Updating the User Entity</h3>
<p>The <code>User</code> entity was updated to include a field for storing the API key:</p>

<pre><code>import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  apiKey: string;

  // Other fields...
}
</code></pre>

<p>In this entity:</p>
<ul>
  <li><code>apiKey</code> stores the user's API key, which is generated when the user is registered or requests an API key.</li>
</ul>

<h3>2. Implementing API Key Generation and Validation</h3>
<p>The <code>AuthService</code> was updated with methods to handle the generation and validation of API keys:</p>

<pre><code>import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateAPIKey(userId: string): Promise<string> {
    const apiKey = randomBytes(32).toString('hex');
    await this.userService.updateApiKey(userId, apiKey);
    return apiKey;
  }

  async validateApiKey(apiKey: string) {
    const user = await this.userService.findByApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return user;
  }

  // Other methods...
}
</code></pre>

<p>These methods allow the application to generate and validate API keys:</p>
<ul>
  <li><code>generateAPIKey</code> creates a new API key for the user and stores it in the database.</li>
  <li><code>validateApiKey</code> checks if the provided API key is valid and returns the associated user.</li>
</ul>

<h3>3. Creating API Key Authentication Strategy</h3>
<p>A custom strategy was created to handle API Key authentication using the <code>passport-http-bearer</code> strategy:</p>

<pre><code>import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(apiKey: string) {
    const user = await this.authService.validateApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return user;
  }
}
</code></pre>

<p>This strategy validates the API key extracted from the request's <code>Authorization</code> header and ensures the associated user exists.</p>

<h3>4. Combining JWT and API Key Authentication</h3>
<p>The application was configured to support both JWT and API key authentication. The <code>CombinedAuthGuard</code> allows for checking both JWT tokens and API keys in the same route:</p>

<pre><code>import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from '../auth.service';

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
      // If JWT fails, fall back to API key authentication
      const apiKey = request.headers['x-api-key'];
      if (apiKey) {
        const user = await this.authService.validateApiKey(apiKey);
        if (user) {
          request.user = user; // Attach the user to the request object
          return true;
        }
      }
    }

    return false;
  }
}
</code></pre>

<h3>5. Updating the Auth Controller</h3>
<p>The <code>AuthController</code> was updated to handle API key generation and validation:</p>

<pre><code>import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CombinedAuthGuard } from './guards/combined-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('generate-api-key')
  @UseGuards(CombinedAuthGuard)
  async generateApiKey(@Req() req) {
    const apiKey = await this.authService.generateAPIKey(req.user.userId);
    return { apiKey };
  }

  // Other endpoints...
}
</code></pre>

<p>This route allows authenticated users to generate an API key, which can be used for subsequent requests.</p>

<h3>Next Steps</h3>
<p>With API Key authentication integrated, the next steps involve refining the security measures, such as implementing rate limiting or IP whitelisting for API key access. Additionally, consider logging and monitoring API key usage to detect and prevent abuse.</p>
