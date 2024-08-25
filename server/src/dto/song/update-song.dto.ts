import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsOptional,
  IsString,
} from 'class-validator';
import { Artist } from '../../entities/artist.entity';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly artist?: Artist[];

  @IsDateString()
  @IsOptional()
  readonly releaseDate?: Date;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration?: Date;

  @IsString()
  @IsOptional()
  readonly lyrics?: string;
}
