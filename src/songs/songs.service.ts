import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Song } from '../entities/songs.entity';
import { CreateSongDto } from '../dto/song/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDto } from '../dto/song/update-song.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from '../entities/artist.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  // Create a new song
  async create(songData: CreateSongDto): Promise<Song> {
    const song = new Song();
    song.title = songData.title;
    song.artists = songData.artist;
    song.releaseDate = songData.releaseDate;
    song.duration = songData.duration;
    song.lyrics = songData.lyrics;
    song.artists = await this.artistRepository.findByIds(songData.artist);
    return await this.songRepository.save(song);
  }

  // Retrieve all songs
  findAll(): Promise<Song[]> {
    return this.songRepository.find();
  }

  // Retrieve a single song by ID
  async findOne(id: string): Promise<Song> {
    const song = await this.songRepository.findOne({ where: { id } });
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  // Update an existing song by ID
  async update(id: string, updateData: UpdateSongDto): Promise<UpdateResult> {
    return this.songRepository.update(id, updateData);
  }

  // Delete a song by ID
  async delete(id: string): Promise<void> {
    const song = await this.findOne(id);
    await this.songRepository.remove(song);
  }
  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('song');
    queryBuilder.orderBy('song.releaseDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }
}
