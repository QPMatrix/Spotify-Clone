<h1>📄 API Documentation</h1>

<h3>Overview</h3>
<p>This branch introduces JWT-based authentication in the Spotify Clone backend. The implementation includes the setup of the <code>AuthModule</code>, a JWT strategy, and guards to protect routes, ensuring that only authenticated users can access certain parts of the application. Additionally, a specialized guard is provided for artists, ensuring role-based access control.</p>

<h3>Authentication Setup</h3>
<p>The authentication system is built using <code>@nestjs/passport</code> and <code>jsonwebtoken</code>. The following steps outline how JWT authentication was implemented:</p>

<h3>1. Setting Up the Auth Module</h3>
<p>The <code>AuthModule</code> is responsible for managing authentication in the application. It imports the necessary modules, including the <code>UserModule</code> and <code>ArtistsModule</code>, and registers the JWT module:</p>

<pre><code>import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [
    UserModule,
    ArtistsModule,
    JwtModule.register({ secret: 'secret', signOptions: { expiresIn: '1d' } }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
</code></pre>

<p>In this module:</p>
<ul>
  <li>The <code>JwtModule</code> is configured with a secret key and an expiration time of one day for the tokens.</li>
  <li>The <code>AuthService</code> is provided, and the <code>JwtStrategy</code> is used to validate incoming JWTs.</li>
  <li>The module exports the <code>AuthService</code> for use in other parts of the application.</li>
</ul>

<h3>2. Implementing JWT Strategy</h3>
<p>The <code>JwtStrategy</code> handles the validation of JWTs. It extracts the JWT from the authorization header and validates it using the secret key:</p>

<pre><code>import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadType } from '../../types/Payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }
  async validate(payload: PayloadType) {
    return {
      userId: payload.email,
      email: payload.email,
      artistId: payload.artistId,
    };
  }
}
</code></pre>

<p>In this strategy:</p>
<ul>
  <li><code>ExtractJwt.fromAuthHeaderAsBearerToken()</code> is used to extract the JWT from the request header.</li>
  <li>The <code>validate</code> method returns an object containing user-specific details like <code>userId</code>, <code>email</code>, and <code>artistId</code>, which can be accessed in the request context.</li>
</ul>

<h3>3. Protecting Routes with Guards</h3>
<p>The authentication system uses guards to protect routes. Two types of guards are implemented: <code>JwtAuthGuard</code> for general JWT-based protection and <code>ArtistsJwtGuard</code> for artist-specific protection:</p>

<h4>3.1 JwtAuthGuard</h4>
<pre><code>import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
</code></pre>

<h4>3.2 ArtistsJwtGuard</h4>
<p>The <code>ArtistsJwtGuard</code> extends the <code>JwtAuthGuard</code> to enforce artist-specific access:</p>

<pre><code>import { AuthGuard } from '@nestjs/passport';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ArtistsJwtGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.artistId) {
      return user;
    }
    throw err || new UnauthorizedException();
  }
}
</code></pre>

<p>In this guard:</p>
<ul>
  <li>The <code>handleRequest</code> method checks if the authenticated user has an <code>artistId</code> and throws an exception if not.</li>
</ul>

<h3>4. Applying the Guards to Routes</h3>
<p>The guards can be applied to routes to ensure that only authenticated users can access them:</p>

<pre><code>import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ArtistsJwtGuard } from './auth/artists-jwt.guard';

@Controller('songs')
export class SongsController {
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.songsService.findAll();
  }

  @Get('artist')
  @UseGuards(ArtistsJwtGuard)
  findArtistData() {
    return 'This route is protected and only accessible by artists';
  }
}
</code></pre>

<h3>Next Steps</h3>
<p>With JWT authentication and role-based guards implemented, the next steps involve expanding the role-based access control, refining the business logic, and ensuring that tokens are securely managed and refreshed as needed.</p>
