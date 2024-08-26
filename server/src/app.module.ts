import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './entities/songs.entity';
import { Artist } from './entities/artist.entity';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions } from '../db/data-source';
import { PlaylistModule } from './playlist/playlist.module';
import { SeedModule } from './seed/seed.module';
import { Playlist } from './entities/playlist.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    SongsModule,
    AuthModule,
    UserModule,
    ArtistsModule,
    PlaylistModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSources: DataSource) {
    console.log('Database name:', dataSources.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); options 1
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'songs', method: RequestMethod.POST });  options 2
    consumer.apply(LoggerMiddleware).forRoutes(SongsController); // options 3
  }
}
