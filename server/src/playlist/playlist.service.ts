import { Injectable } from '@nestjs/common';
import { Playlist } from '../entities/playlist.entity';
import { Song } from '../entities/songs.entity';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayListDto } from '../dto/playlist/create-playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepo: Repository<Playlist>,

    @InjectRepository(Song)
    private songsRepo: Repository<Song>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async create(data: CreatePlayListDto): Promise<Playlist> {
    const playList = new Playlist();
    playList.name = data.name;

    playList.songs = await this.songsRepo.findByIds(data.songs);

    playList.user = await this.userRepo.findOneBy({ id: data.user });

    return this.playListRepo.save(playList);
  }
}
