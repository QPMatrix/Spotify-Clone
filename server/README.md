<h1>📄 API Documentation</h1>

<h3>Overview</h3>
<p>In this branch, I've implemented validation middleware for the <code>songs</code> module in the Spotify Clone backend. This setup ensures that incoming requests are properly validated before being processed.</p>

<h3>Setting Up Validation Middleware</h3>
<p>The following packages were installed to enable validation:</p>

<pre><code>pnpm add class-validator class-transformer</code></pre>

<p>After installing these packages, a global validation pipe was added to the <code>main.ts</code> file:</p>

<pre><code>import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe());</code></pre>

<p>This line ensures that all incoming requests are validated according to the DTOs defined in the application.</p>

<h3>Creating the DTO for Songs</h3>
<p>A <code>dto</code> folder was created in the <code>songs</code> module to hold the data transfer objects (DTOs). The <code>CreateSongDto</code> was defined to validate the data required to create a new song:</p>

<pre><code>import {
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
}</code></pre>

<p>This DTO enforces the following validation rules:</p>
<ul>
  <li><code>title</code>: Must be a non-empty string.</li>
  <li><code>artist</code>: Must be a non-empty array of strings.</li>
  <li><code>releaseDate</code>: Must be a valid date string.</li>
  <li><code>duration</code>: Must be in military time format (HH:mm).</li>
</ul>

<h3>Using the DTO in the Songs Controller</h3>
<p>The <code>CreateSongDto</code> is used in the <code>songs</code> controller to validate incoming requests for creating new songs:</p>

<pre><code>import { Controller, Post, Body } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  create(@Body() song: CreateSongDto) {
    return this.songsService.create(song);
  }
}</code></pre>

<h3>Testing the Validation</h3>
<p>To test the validation, use a tool like Postman or curl to send requests with the required data. For example:</p>

<pre><code>{
  "title": "Song Title",
  "artist": ["Artist 1", "Artist 2"],
  "releaseDate": "2024-08-23",
  "duration": "03:45"
}</code></pre>

<p>If the data is valid, the song will be created. If any validation fails, a <code>400 Bad Request</code> response will be returned with details about the validation errors.</p>

<h3>Next Steps</h3>
<p>With the validation middleware and DTOs in place, the next steps will involve refining the business logic, integrating additional features, and ensuring that all incoming requests are properly validated before being processed by the backend.</p>
