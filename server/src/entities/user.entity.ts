import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Playlist } from './playlist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column()
  @Exclude()
  password: string;
  @Column({ nullable: true, type: 'text' })
  twoFactorAuthSecret: string;
  @Column({ default: false, type: 'boolean' })
  enabledTwoFactorAuth: boolean;
  @Column({ nullable: true })
  apiKey: string;
  @OneToMany(() => Playlist, (playList) => playList.user)
  playlists: Playlist[];
}
