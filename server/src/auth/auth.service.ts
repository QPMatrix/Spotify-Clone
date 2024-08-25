import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../dto/auth/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from '../artists/artists.service';
import { EnableTwoFactorAuthPayload, PayloadType } from '../types/Payload';
import * as speakEasy from 'speakeasy';
import { ValidateTokenDto } from '../dto/auth/validate-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
  ) {}

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
  async enableTwoFactorAuth(
    userId: string,
  ): Promise<EnableTwoFactorAuthPayload> {
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
  async disableTwoFactorAuth(userId: string) {
    return this.userService.disableTwoFactorAuthSecret(userId);
  }
}
