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

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany((): typeof Artist => Artist, (artist) => artist.songs, {
    cascade: true,
  })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @Column('date')
  releaseDate: Date;

  @Column('time')
  duration: Date;

  @Column('text', { nullable: true })
  lyrics: string;
  @ManyToOne(() => Playlist, (playList) => playList.songs)
  playlist: Playlist;
}
