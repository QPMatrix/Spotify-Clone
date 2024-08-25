<h1>📄 API Documentation</h1>

<h3>Overview</h3>
<p>This branch introduces the implementation of two-factor authentication (2FA) in the Spotify Clone backend using the <code>speakeasy</code> library. The 2FA feature enhances security by requiring users to provide a second form of authentication in addition to their password. This section covers how 2FA was integrated into the authentication system, including the updates to the user entity, service methods, and authentication logic.</p>

<h3>1. Installing the <code>speakeasy</code> Library</h3>
<p>The <code>speakeasy</code> library was added to the project to manage the generation and verification of time-based one-time passwords (TOTPs) for 2FA:</p>

<pre><code>pnpm add speakeasy</code></pre>

<p>This library provides easy-to-use functions for generating and verifying 2FA tokens.</p>

<h3>2. Updating the User Entity</h3>
<p>The <code>User</code> entity was updated to include fields for storing the 2FA secret and a boolean flag indicating whether 2FA is enabled:</p>

<pre><code>import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  // Other fields...

  @Column({ nullable: true, type: 'text' })
  twoFactorAuthSecret: string;

  @Column({ default: false, type: 'boolean' })
  enabledTwoFactorAuth: boolean;
}
</code></pre>

<p>In this entity:</p>
<ul>
  <li><code>twoFactorAuthSecret</code> stores the user's 2FA secret key, which is generated when 2FA is enabled.</li>
  <li><code>enabledTwoFactorAuth</code> indicates whether 2FA is enabled for the user.</li>
</ul>

<h3>3. Adding Methods to the User Service</h3>
<p>The <code>UserService</code> was updated with methods to manage the 2FA secret and toggle the 2FA state:</p>

<pre><code>import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
  // Other methods...

  async updateTwoFactorAuthSecret(
    id: string,
    secret: string,
  ): Promise<UpdateResult> {
    return this.userRepository.update(id, {
      twoFactorAuthSecret: secret,
      enabledTwoFactorAuth: true,
    });
  }

  async disableTwoFactorAuthSecret(id: string): Promise<UpdateResult> {
    return this.userRepository.update(id, {
      twoFactorAuthSecret: null,
      enabledTwoFactorAuth: false,
    });
  }
}
</code></pre>

<p>These methods allow the application to enable or disable 2FA for a user by updating the relevant fields in the database.</p>

<h3>4. Updating the Login Method</h3>
<p>The <code>login</code> method in the <code>AuthService</code> was updated to handle the 2FA process:</p>

<pre><code>import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  // Other methods...

  async login(
    loginData: LoginDto,
  ): Promise<{ accessToken: string } | { message: string }> {
    const user = await this.userService.findOne(loginData);
    const isMatchedPassword = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (isMatchedPassword) {
      delete user.password;
      const payload: PayloadType = { email: user.email, userId: user.id };
      const isArtist = await this.artistService.findArtistById(user.id);

      if (isArtist) {
        payload.artistId = isArtist.id;
      }

      if (user.enabledTwoFactorAuth && user.twoFactorAuthSecret) {
        return { message: 'Please submit the token' };
      }

      return { accessToken: this.jwtService.sign(payload) };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
</code></pre>

<p>In this method:</p>
<ul>
  <li>If 2FA is enabled for the user, a message is returned asking the user to submit the 2FA token.</li>
  <li>If 2FA is not enabled, the JWT token is returned immediately after successful password validation.</li>
</ul>

<h3>5. Implementing 2FA Management Functions</h3>
<p>Three additional functions were added to the <code>AuthService</code> to handle enabling, validating, and disabling 2FA:</p>

<h4>5.1 Enabling 2FA</h4>

<pre><code>import * as speakEasy from 'speakeasy';

async enableTwoFactorAuth(
  userId: string,
): Promise<{ secret: string }> {
  const user = await this.userService.findById(userId);

  if (user.enabledTwoFactorAuth) {
    return { secret: user.twoFactorAuthSecret };
  }

  user.twoFactorAuthSecret = speakEasy.generateSecret().base32;

  await this.userService.updateTwoFactorAuthSecret(
    user.id,
    user.twoFactorAuthSecret,
  );

  return { secret: user.twoFactorAuthSecret };
}
</code></pre>

<h4>5.2 Validating 2FA</h4>

<pre><code>import * as speakEasy from 'speakeasy';

async validateTwoFactorAuth(
  userId: string,
  data: ValidateTokenDto,
): Promise<{ verified: boolean }> {
  try {
    const user = await this.userService.findById(userId);
    const isValid = speakEasy.totp.verify({
      secret: user.twoFactorAuthSecret,
      encoding: 'base32',
      token: data.token,
    });

    return { verified: isValid };
  } catch (err) {
    throw new UnauthorizedException('Invalid token', err);
  }
}
</code></pre>

<h4>5.3 Disabling 2FA</h4>

<pre><code>async disableTwoFactorAuth(userId: string) {
  return this.userService.disableTwoFactorAuthSecret(userId);
}
</code></pre>

<h3>6. Updating the Auth Controller</h3>
<p>The <code>AuthController</code> was updated to include routes for managing 2FA:</p>

<pre><code>import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('enable-two-factor-auth')
  @UseGuards(JwtAuthGuard)
  enableTwoFactorAuth(@Req() req) {
    return this.authService.enableTwoFactorAuth(req.user.userId);
  }

  @Post('validate-two-factor-auth')
  @UseGuards(JwtAuthGuard)
  validateTwoFactorAuth(@Req() req, @Body() data: ValidateTokenDto) {
    return this.authService.validateTwoFactorAuth(req.user.userId, data);
  }

  @Post('disable-two-factor-auth')
  @UseGuards(JwtAuthGuard)
  disableTwoFactorAuth(@Req() req) {
    return this.authService.disableTwoFactorAuth(req.user.userId);
  }
}
</code></pre>

<p>These routes allow users to enable, validate, and disable 2FA. The <code>JwtAuthGuard</code> is used to ensure that only authenticated users can access these endpoints.</p>

<h3>Next Steps</h3>
<p>With 2FA integrated into the authentication process, the next steps involve testing the feature thoroughly, ensuring a smooth user experience, and considering the implementation of backup codes or other methods for account recovery in case users lose access to their 2FA device.</p>
