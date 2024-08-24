import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly artist?: string[];

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
