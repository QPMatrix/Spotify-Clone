import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Playlist } from './playlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email address of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
    nullable: true,
  })
  @Column({ unique: true, nullable: true })
  phone: string;

  @Exclude()
  @ApiProperty({
    description: 'The hashed password of the user (excluded from responses)',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'The 2FA secret key for the user',
    nullable: true,
  })
  @Column({ nullable: true, type: 'text' })
  twoFactorAuthSecret: string;

  @ApiProperty({
    example: false,
    description: 'Flag indicating whether 2FA is enabled',
  })
  @Column({ default: false, type: 'boolean' })
  enabledTwoFactorAuth: boolean;

  @ApiProperty({
    description: 'API key for authenticating the user',
    nullable: true,
  })
  @Column({ nullable: true })
  apiKey: string;

  @OneToMany(() => Playlist, (playList) => playList.user)
  @ApiProperty({
    type: () => [Playlist],
    description: 'List of playlists associated with the user',
  })
  playlists: Playlist[];
}
