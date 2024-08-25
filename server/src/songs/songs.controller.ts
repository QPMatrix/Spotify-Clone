import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Scope,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Song } from '../entities/songs.entity';

@Controller({
  path: 'songs',
  scope: Scope.REQUEST,
})
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  // Create a new song
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

  // Retrieve all songs
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    return this.songsService.paginate({
      page,
      limit,
    });
  }

  // Retrieve a single song by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.songsService.findOne(id);
    } catch (e) {
      console.error('Error retrieving song:', e.message);
      throw new HttpException(
        `Song with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Update an existing song by ID
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

  // Delete a song by ID
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
}
