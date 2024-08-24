<h1>📄 API Documentation</h1>

<h3>Overview</h3>
<p>This branch introduces the integration of TypeORM for managing database operations in the Spotify Clone backend. TypeORM is used to interact with a MySQL database, providing a structured approach to data management through entities, repositories, and services.</p>

<h3>TypeORM Integration</h3>
<p>The integration of TypeORM into the project involved several key steps, which are outlined below:</p>

<h3>1. Installing TypeORM and MySQL Packages</h3>
<p>TypeORM and the MySQL driver were added to the project using <strong>pnpm</strong>:</p>

<pre><code>pnpm add @nestjs/typeorm typeorm mysql2</code></pre>

<p>This command installs the necessary packages for TypeORM to work with a MySQL database.</p>

<h3>2. Configuring TypeORM in the App Module</h3>
<p>TypeORM was configured in the <code>AppModule</code> to connect to the MySQL database:</p>

<pre><code>import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/songs.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: 'spotify_clone',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      entities: [Song],
      synchronize: true,
    }),
    SongsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSources: DataSource) {
    console.log('Database name:', dataSources.driver.database);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}</code></pre>

<p>This setup connects the application to a MySQL database named <code>spotify_clone</code> running on <code>localhost</code>, with the root user credentials. The <code>synchronize</code> option is enabled to automatically sync the database schema with the entity definitions.</p>

<h3>3. Creating the Song Entity</h3>
<p>The <code>Song</code> entity defines the structure of the song records in the database:</p>

<pre><code>import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
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
}</code></pre>

<p>This entity includes the following fields:</p>
<ul>
  <li><strong>id:</strong> A UUID that uniquely identifies each song.</li>
  <li><strong>title:</strong> The title of the song.</li>
  <li><strong>artists:</strong> An array of artist names stored as JSON.</li>
  <li><strong>releaseDate:</strong> The release date of the song.</li>
  <li><strong>duration:</strong> The duration of the song, stored as a time value.</li>
  <li><strong>lyrics:</strong> The lyrics of the song, stored as text (optional).</li>
</ul>

<h3>4. Updating the Service to Use TypeORM Repository</h3>
<p>The <code>SongsService</code> was updated to interact with the database using TypeORM's repository pattern:</p>

<pre><code>import { Injectable, Scope, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from '../entities/songs.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async create(songData: CreateSongDto): Promise<Song> {
    const song = new Song();
    song.title = songData.title;
    song.artists = songData.artist;
    song.releaseDate = songData.releaseDate;
    song.duration = songData.duration;
    song.lyrics = songData.lyrics;
    return await this.songRepository.save(song);
  }

  findAll(): Promise<Song[]> {
    return this.songRepository.find();
  }

  async findOne(id: string): Promise<Song> {
    const song = await this.songRepository.findOne({ where: { id } });
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  async update(id: string, updateData: UpdateSongDto): Promise<Song> {
    const song = await this.findOne(id);
    Object.assign(song, updateData);
    return this.songRepository.save(song);
  }

  async delete(id: string): Promise<void> {
    const song = await this.findOne(id);
    await this.songRepository.remove(song);
  }
}</code></pre>

<p>The <code>SongsService</code> now handles CRUD operations by interacting with the <code>Song</code> repository.</p>

<h3>5. Creating the Update DTO</h3>
<p>To support updating songs, an <code>UpdateSongDto</code> was created:</p>

<pre><code>import { IsArray, IsDateString, IsMilitaryTime, IsOptional, IsString } from 'class-validator';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly artist?: string[];

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

<p>This DTO allows partial updates to the song's data, with all fields marked as optional.</p>

<h3>6. Updating the Songs Controller</h3>
<p>The <code>SongsController</code> was updated to handle all CRUD operations, using the <code>SongsService</code> to interact with the database:</p>

<pre><code>import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Scope,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller({
  path: 'songs',
  scope: Scope.REQUEST,
})
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  async create(@Body() songData: CreateSongDto) {
    try {
      const song = await this.songsService.create(songData);
      return {
        message: 'Song created successfully',
        song,
      };
    } catch (e) {
      console.error('Error creating song:', e.message);
      throw new HttpException(
        'An error occurred while creating the song',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const song = await this.songsService.findOne(id);
      return song;
    } catch (e) {
      console.error('Error retrieving song:', e.message);
      throw new HttpException(
        `Song with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: UpdateSongDto) {
    try {
      const updatedSong = await this.songsService.update(id, updateData);
      return {
        message: 'Song updated successfully',
        updatedSong,
      };
    } catch (e) {
      console.error('Error updating song:', e.message);
      throw new HttpException(
        `An error occurred while updating the song with ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.songsService.delete(id);
      return {
        message: `Song with ID ${id} deleted successfully`,
      };
    } catch (e) {
      console.error('Error deleting song:', e.message);
      throw new HttpException(
        `An error occurred while deleting the song with ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}</code></pre>

<h3>Endpoints Summary</h3>
<p>The following endpoints are managed by the <code>SongsController</code>:</p>
<ul>
  <li><code>POST /songs</code> - Create a new song</li>
  <li><code>GET /songs</code> - Retrieve all songs</li>
  <li><code>GET /songs/:id</code> - Retrieve a specific song by ID</li>
  <li><code>PUT /songs/:id</code> - Update a specific song by ID</li>
  <li><code>DELETE /songs/:id</code> - Delete a specific song by ID</li>
</ul>

<h3>Next Steps</h3>
<p>With TypeORM fully integrated, the next steps will involve refining the business logic, implementing additional features, and ensuring that the application scales effectively as more data is added to the database.</p>
