import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from './songs.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'The unique identifier of the playlist',
  })
  id: string;

  @ApiProperty({
    example: 'My Favorite Playlist',
    description: 'The name of the playlist',
  })
  @Column()
  name: string;

  @OneToMany(() => Song, (song) => song.playlist)
  @ApiProperty({
    type: () => [Song],
    description: 'List of songs in the playlist',
  })
  songs: Song[];

  @ManyToOne(() => User, (user) => user.playlists)
  @ApiProperty({
    type: () => User,
    description: 'The user who owns the playlist',
  })
  user: User;
}
