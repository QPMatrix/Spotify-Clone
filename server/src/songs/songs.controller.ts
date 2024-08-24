import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Scope,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';

@Controller({
  path: 'songs',
  scope: Scope.REQUEST,
})
export class SongsController {
  constructor(private songsService: SongsService) {}
  @Post()
  create(@Body() song: CreateSongDto) {
    return this.songsService.create(song);
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
