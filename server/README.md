<h1>📄 API Documentation</h1>

<h3>Overview</h3>
<p>This branch introduces the implementation of relationships between the <code>Song</code> and <code>Artist</code> entities in the Spotify Clone backend using TypeORM. Additionally, it covers how to manage these relationships within the DTOs used for updating records.</p>

<h3>Entity Relationships</h3>
<p>Entity relationships are a crucial aspect of database design, allowing us to define how different entities like <code>Songs</code> and <code>Artists</code> are connected. The following steps outline how these relationships were implemented and managed:</p>

<h3>1. Defining Many-to-Many Relationship (Songs & Artists)</h3>
<p>The <code>Song</code> and <code>Artist</code> entities have a many-to-many relationship, meaning each song can have multiple artists, and each artist can contribute to multiple songs. This relationship is defined as follows:</p>

<pre><code>import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from './artist.entity';

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
}</code></pre>

<p>In the above <code>Song</code> entity:</p>
<ul>
  <li>The <code>@ManyToMany</code> decorator establishes the many-to-many relationship with the <code>Artist</code> entity.</li>
  <li>The <code>@JoinTable</code> decorator specifies the name of the join table that manages the relationship between songs and artists.</li>
  <li>The <code>cascade: true</code> option allows related entities (artists) to be automatically saved when a song is saved.</li>
</ul>

<h3>2. Defining One-to-One and Many-to-Many Relationship (Artists & Users)</h3>
<p>The <code>Artist</code> entity has a one-to-one relationship with a <code>User</code> entity and a many-to-many relationship with the <code>Song</code> entity:</p>

<pre><code>import {
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
}</code></pre>

<p>In the above <code>Artist</code> entity:</p>
<ul>
  <li>The <code>@OneToOne</code> decorator establishes a one-to-one relationship with the <code>User</code> entity.</li>
  <li>The <code>@JoinColumn</code> decorator indicates that this entity owns the relationship (i.e., it contains the foreign key).</li>
  <li>The <code>@ManyToMany</code> decorator is used to link the artist with multiple songs.</li>
</ul>

<h3>3. Updating the DTO to Handle Relationships</h3>
<p>To manage these relationships effectively, the <code>UpdateSongDto</code> was updated to include the <code>Artist</code> entity. This allows for the association of artists with songs during the update process:</p>

<pre><code>import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Artist } from '../../entities/artist.entity';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Artist)
  @IsOptional()
  readonly artists?: Artist[];

  @IsDateString()
  @IsOptional()
  readonly releaseDate?: Date;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration?: Date;

  @IsString()
  @IsOptional()
  readonly lyrics?: string;
}</code></pre>

<p>Key points about the DTO update:</p>
<ul>
  <li>The <code>artists</code> field is an array of <code>Artist</code> entities, allowing multiple artists to be associated with a song.</li>
  <li><code>ValidateNested</code> and <code>Type(() => Artist)</code> are used to ensure that each element in the <code>artists</code> array is a valid <code>Artist</code> entity.</li>
  <li>All fields in the DTO are optional, supporting partial updates to the song's data.</li>
</ul>

<h3>4. Integrating the Relationships in Services and Controllers</h3>
<p>To fully leverage these relationships, the services and controllers must be updated to handle the related data appropriately. For instance, when creating or updating a song, the related artists must be managed:</p>

<pre><code>import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../../entities/songs.entity';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async update(id: string, updateData: UpdateSongDto): Promise<Song> {
    const song = await this.songRepository.findOne(id, { relations: ['artists'] });
    Object.assign(song, updateData);
    return this.songRepository.save(song);
  }
}</code></pre>

<h3>Next Steps</h3>
<p>With these relationships and DTO updates in place, the next steps involve further refining the business logic to ensure data integrity and efficient querying. Additional entities like <code>Album</code> can be integrated in a similar manner, expanding the relationships and data management capabilities of the backend.</p>
