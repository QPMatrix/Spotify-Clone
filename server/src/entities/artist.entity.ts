import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Song } from './songs.entity';
@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne((): typeof User => User)
  @JoinColumn()
  user: User;
  @ManyToMany((): typeof Song => Song, (song) => song.artists)
  songs: Song[];
}
