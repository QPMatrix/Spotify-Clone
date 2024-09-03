import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Song } from './songs.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'The unique identifier of the artist',
  })
  id: string;

  @OneToOne((): typeof User => User)
  @JoinColumn()
  @ApiProperty({
    type: () => User,
    description: 'The user associated with the artist profile',
  })
  user: User;

  @ManyToMany((): typeof Song => Song, (song) => song.artists)
  @ApiProperty({
    type: () => [Song],
    description: 'List of songs associated with the artist',
  })
  songs: Song[];
}
