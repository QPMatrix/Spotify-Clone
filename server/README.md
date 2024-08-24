<h1>📄 API Documentation</h1>

<h3>Overview</h3>
<p>In this branch, I've implemented a custom logger middleware for the Spotify Clone backend using NestJS. This middleware logs each incoming request with a timestamp, helping to monitor and debug the application effectively.</p>

<h3>Creating the Logger Middleware</h3>
<p>To generate the logger middleware, the following command was used:</p>

<pre><code>nest g mi common/middleware/logger --no-spec --no-flat</code></pre>

<p>This command creates the <code>LoggerMiddleware</code> in the <code>common/middleware/logger</code> directory, with the necessary structure.</p>

<h3>Implementing the Logger Middleware</h3>
<p>The <code>LoggerMiddleware</code> was implemented to log the incoming requests. The code is as follows:</p>

<pre><code>import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Request...', new Date().toDateString());
    next();
  }
}</code></pre>

<p>This middleware logs the request details and the current date whenever a request is received.</p>

<h3>Applying the Middleware in the App Module</h3>
<p>The middleware was applied to the <code>SongsModule</code> in the <code>AppModule</code>. Here are the different options for applying the middleware:</p>

<h4>Option 1: Applying to All Routes in the Songs Module</h4>
<p>The middleware can be applied to all routes in the <code>SongsModule</code> as follows:</p>

<pre><code>import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';

@Module({
  imports: [SongsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('songs');
  }
}</code></pre>

<h4>Option 2: Applying to a Specific Route and Method</h4>
<p>The middleware can be applied to a specific route and method (e.g., POST requests to <code>/songs</code>):</p>

<pre><code>import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';

@Module({
  imports: [SongsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'songs', method: RequestMethod.POST });
  }
}</code></pre>

<h4>Option 3: Applying to a Specific Controller</h4>
<p>The middleware can also be applied to all routes handled by a specific controller:</p>

<pre><code>import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { SongsController } from './songs/songs.controller';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';

@Module({
  imports: [SongsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}</code></pre>

<h3>Testing the Logger Middleware</h3>
<p>Once the middleware is applied, you can test it by sending requests to the relevant routes. The middleware will log the request and the current date to the console, allowing you to verify that it is functioning correctly.</p>

<h3>Next Steps</h3>
<p>With the <code>LoggerMiddleware</code> in place, you can now monitor and log requests effectively. Further customizations can be made to the middleware to log additional details or integrate with external logging services.</p>
