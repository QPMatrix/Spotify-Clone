import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  readonly artist: string[];
  @IsNotEmpty()
  @IsDateString()
  readonly releaseDate: Date;
  @IsMilitaryTime()
  @IsNotEmpty()
  readonly duration: Date;
}
