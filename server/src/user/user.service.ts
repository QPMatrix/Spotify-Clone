import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/user/create-user.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(userData: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }
  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

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

  async findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
