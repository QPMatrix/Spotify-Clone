<h1>📄 API Documentation</h1>

<h3>Overview</h3>
<p>This branch introduces the implementation of pagination in the Spotify Clone backend using TypeORM and <code>nestjs-typeorm-paginate</code>. Pagination helps in efficiently managing and retrieving large datasets by breaking them into smaller, manageable pages.</p>

<h3>Pagination Integration</h3>
<p>The integration of pagination into the project involved several key steps, which are outlined below:</p>

<h3>1. Installing Pagination Package</h3>
<p>To enable pagination, the <code>nestjs-typeorm-paginate</code> package was added to the project using <strong>pnpm</strong>:</p>

<pre><code>pnpm add nestjs-typeorm-paginate</code></pre>

<p>This package provides easy-to-use pagination functionality for TypeORM repositories and query builders.</p>

<h3>2. Implementing Pagination in the Songs Service</h3>
<p>The <code>SongsService</code> was updated to include a method for paginating through song records:</p>

<pre><code>import { Injectable, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from '../entities/songs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable({ scope: Scope.TRANSIENT })
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('song');
    return paginate<Song>(queryBuilder, options);
  }
}</code></pre>

<p>Key points about the pagination method:</p>
<ul>
  <li><strong>Query Builder:</strong> The <code>createQueryBuilder</code> method is used to build a query for the <code>Song</code> entity. This query is then passed to the <code>paginate</code> function.</li>
  <li><strong>Paginate Function:</strong> The <code>paginate</code> function is provided by the <code>nestjs-typeorm-paginate</code> package and handles the pagination logic.</li>
  <li><strong>Pagination Options:</strong> The method accepts <code>IPaginationOptions</code>, which typically include parameters like <code>page</code> and <code>limit</code> to control pagination behavior.</li>
</ul>

<h3>3. Updating the Songs Controller</h3>
<p>The <code>SongsController</code> was updated to expose an endpoint for paginated song retrieval:</p>

<pre><code>import { Controller, Get, Query } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { SongsService } from './songs.service';
import { Song } from '../entities/songs.entity';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async paginate(@Query() options: IPaginationOptions): Promise<Pagination<Song>> {
    return this.songsService.paginate(options);
  }
}</code></pre>

<p>This controller method handles GET requests to the <code>/songs</code> endpoint and returns a paginated list of songs based on the provided query parameters.</p>

<h3>4. Example of Using the Pagination Endpoint</h3>
<p>To retrieve a paginated list of songs, you can make a GET request to the <code>/songs</code> endpoint with the following query parameters:</p>

<pre><code>GET /songs?page=1&limit=10</code></pre>

<p>This request retrieves the first page of songs, with a maximum of 10 songs per page. The response will include pagination metadata, such as the total number of records, the current page, and the total number of pages.</p>

<h3>Next Steps</h3>
<p>With pagination now implemented, the next steps will involve testing the pagination functionality under different conditions, optimizing queries for performance, and potentially adding additional filters or sorting options to enhance the pagination features.</p>
