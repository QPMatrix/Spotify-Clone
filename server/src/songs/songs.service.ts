import { Injectable, Scope, NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
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

  // Create a new song
  async create(songData: CreateSongDto): Promise<Song> {
    const song = new Song();
    song.title = songData.title;
    song.artists = songData.artist;
    song.releaseDate = songData.releaseDate;
    song.duration = songData.duration;
    song.lyrics = songData.lyrics;
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
    const song = await this.findOne(id);
    Object.assign(song, updateData);
    return this.songRepository.save(song);
  }

  // Delete a song by ID
  async delete(id: string): Promise<void> {
    const song = await this.findOne(id);
    await this.songRepository.remove(song);
  }
}
