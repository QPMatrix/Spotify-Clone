import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}
  @Post()
  create() {
    return this.songsService.create('Animal by Martin Garrix');
  }
  @Get()
  findAll() {
    return this.songsService.findAll();
  }
  @Get(':id')
  findOne() {
    return 'This action returns a song with id';
  }
  @Put(':id')
  update() {
    return 'This action updates a song with id';
  }
  @Delete(':id')
  delete() {
    return 'This action delete a song with id';
  }
}
