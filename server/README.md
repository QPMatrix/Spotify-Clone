<h1>📄 API Documentation</h1>

<h3>Overview</h3>
<p>This branch introduces scoped controllers and services in the Spotify Clone backend. Specifically, the <code>SongsController</code> is request-scoped, and the <code>SongsService</code> is transient. This setup ensures that each request is handled with isolated controller instances, while each service instance is unique whenever it is used within a request.</p>

<h3>Songs Controller</h3>
<p>The <code>SongsController</code> is responsible for handling all HTTP requests related to songs. It is scoped to the request level, meaning a new instance of the controller is created for each incoming request. This allows for request-specific state to be maintained within the controller.</p>

<pre><code>import {
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
    return 'This action deletes a song with id';
  }
}</code></pre>

<h3>Songs Service</h3>
<p>The <code>SongsService</code> is responsible for the business logic related to songs. It is transient-scoped, meaning a new instance of the service is created every time it is injected. This ensures that the service does not maintain any shared state across different uses within the same request or across requests.</p>

<pre><code>import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class SongsService {
  private readonly songs = [];

  create(song) {
    this.songs.push(song);
    return this.songs;
  }

  findAll() {
    return this.songs;
  }
}</code></pre>

<h3>Explanation of Scopes</h3>
<ul>
  <li><strong>Request Scope (Controller):</strong> A new instance of the <code>SongsController</code> is created for every incoming request. This means that each request is handled by its own isolated controller instance, preventing any potential cross-request state issues.</li>
  <li><strong>Transient Scope (Service):</strong> The <code>SongsService</code> is created afresh each time it is injected. This ensures that no state is shared unintentionally, allowing for highly independent operations within the service.</li>
</ul>

<h3>Endpoints Summary</h3>
<p>The following endpoints are managed by the <code>SongsController</code>:</p>
<ul>
  <li><code>POST /songs</code> - Create a new song</li>
  <li><code>GET /songs</code> - Retrieve all songs</li>
  <li><code>GET /songs/:id</code> - Retrieve a specific song by ID (placeholder implementation)</li>
  <li><code>PUT /songs/:id</code> - Update a specific song by ID (placeholder implementation)</li>
  <li><code>DELETE /songs/:id</code> - Delete a specific song by ID (placeholder implementation)</li>
</ul>

<h3>Next Steps</h3>
<p>With the scoped controller and service in place, the next steps will involve implementing the full logic for the <code>findOne</code>, <code>update</code>, and <code>delete</code> methods, as well as integrating additional features as needed.</p>
