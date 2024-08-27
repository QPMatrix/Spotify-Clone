import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArtistsModule } from './artists/artists.module';
import { PlaylistModule } from './playlist/playlist.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { typeOrmAsyncConfig } from '../db/data-source';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.pro'],
      isGlobal: true,
      load: [config],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
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
