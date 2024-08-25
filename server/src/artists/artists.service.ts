import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Artist } from '../entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  findArtistById(userId: string): Promise<Artist> {
    return this.artistRepository.findOneBy({ user: { id: userId } });
  }
}
