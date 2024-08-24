import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column('json')
  artists: string[];

  @Column('date')
  releaseDate: Date;

  @Column('time')
  duration: Date;

  @Column('text', { nullable: true })
  lyrics: string;
}
