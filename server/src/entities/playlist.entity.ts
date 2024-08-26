import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from './songs.entity';
import { User } from './user.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany(() => Song, (song) => song.playlist)
  songs: Song[];
  @ManyToOne(() => User, (user) => user.playlists)
  user: User;
}
