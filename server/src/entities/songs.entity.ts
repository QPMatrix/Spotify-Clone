import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Playlist } from './playlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'The unique identifier of the song',
  })
  id: string;

  @ApiProperty({ example: 'Song Title', description: 'The title of the song' })
  @Column()
  title: string;

  @ManyToMany((): typeof Artist => Artist, (artist) => artist.songs, {
    cascade: true,
  })
  @JoinTable({ name: 'songs_artists' })
  @ApiProperty({
    type: () => [Artist],
    description: 'List of artists associated with the song',
  })
  artists: Artist[];

  @ApiProperty({
    example: '2024-08-23',
    description: 'The release date of the song',
  })
  @Column('date')
  releaseDate: Date;

  @ApiProperty({ example: '00:03:30', description: 'The duration of the song' })
  @Column('time')
  duration: Date;

  @ApiProperty({
    example: 'Lyrics of the song...',
    description: 'Lyrics of the song',
    nullable: true,
  })
  @Column('text', { nullable: true })
  lyrics: string;

  @ManyToOne(() => Playlist, (playList) => playList.songs)
  @ApiProperty({
    type: () => Playlist,
    description: 'The playlist associated with the song',
  })
  playlist: Playlist;
}
