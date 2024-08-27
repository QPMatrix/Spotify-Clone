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
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from '../dto/song/create-song.dto';
import { UpdateSongDto } from '../dto/song/update-song.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Song } from '../entities/songs.entity';
import { ArtistsJwtGuard } from '../auth/guards/artists-jwt.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@Controller({
  path: 'songs',
  scope: Scope.REQUEST,
})
@ApiTags('Songs')
@ApiBearerAuth()
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  // Create a new song
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(ArtistsJwtGuard)
  @ApiOperation({ summary: 'Create a new song' })
  @ApiBody({ type: CreateSongDto })
  @ApiResponse({
    status: 201,
    description: 'The song has been successfully created.',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while creating the song.',
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve all songs with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default is 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default is 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of songs.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retrieve a song by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the song to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the song.',
  })
  @ApiResponse({
    status: 404,
    description: 'Song not found',
  })
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
  @UseGuards(ArtistsJwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a song by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the song to update',
  })
  @ApiBody({ type: UpdateSongDto })
  @ApiResponse({
    status: 200,
    description: 'The song has been successfully updated.',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while updating the song.',
  })
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
  @UseGuards(ArtistsJwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a song by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the song to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The song has been successfully deleted.',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while deleting the song.',
  })
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
