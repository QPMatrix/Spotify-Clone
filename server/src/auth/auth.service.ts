import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../dto/auth/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from '../artists/artists.service';
import { PayloadType } from '../types/Payload';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
  ) {}

  async login(loginData: LoginDto): Promise<{ accessToken: string }> {
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
      return { accessToken: this.jwtService.sign(payload) };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
