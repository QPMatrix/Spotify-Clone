import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlayListDto } from '../dto/playlist/create-playlist.dto';
import { Playlist } from '../entities/playlist.entity';

@Controller('playlist')
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
