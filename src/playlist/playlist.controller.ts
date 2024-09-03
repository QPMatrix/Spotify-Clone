import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlayListDto } from '../dto/playlist/create-playlist.dto';
import { Playlist } from '../entities/playlist.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('playlist')
@ApiTags('Playlist')
export class PlaylistController {
  constructor(private playListService: PlaylistService) {}
  @Post()
  create(
    @Body()
    playlistDTO: CreatePlayListDto,
  ): Promise<Playlist> {
    return this.playListService.create(playlistDTO);
  }
}
