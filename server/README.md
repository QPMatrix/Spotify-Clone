<h1>📄 Database Migrations and Seeding</h1>

<h3>1. Migrations</h3>

<h4>1.1. Overview</h4>
<p>Migrations are used to modify your database schema incrementally, keeping your database schema in sync with your codebase. This ensures that your database structure is versioned and consistent across different environments.</p>

<h4>1.2. Setting Up Migrations</h4>
<p>In your <code>package.json</code>, the following scripts have been added to manage migrations:</p>

<pre><code>{
  "scripts": {
    "typeorm": "pnpm run build && npx typeorm -d dist/db/data-source.js",
    "migration:generate": "pnpm run typeorm -- migration:generate",
    "migration:run": "pnpm run typeorm -- migration:run",
    "migration:revert": "pnpm run typeorm -- migration:revert"
  }
}
</code></pre>

<h4>1.3. Running Migrations</h4>
<p>To generate a new migration, use the following command:</p>
<pre><code>pnpm run migration:generate -- <em>migration_name</em></code></pre>

<p>This command will create a new migration file in the <code>db/migrations</code> directory. The migration file will contain the SQL queries required to update the database schema.</p>

<p>To apply the migrations, use:</p>
<pre><code>pnpm run migration:run</code></pre>

<p>To revert the last migration, use:</p>
<pre><code>pnpm run migration:revert</code></pre>

<h3>2. Seeding</h3>

<h4>2.1. Overview</h4>
<p>Seeding is the process of populating your database with initial data. This can be useful for setting up initial configurations, testing, or demo purposes.</p>

<h4>2.2. Setting Up Seed Data</h4>
<p>Your application includes a seeding script located at <code>src/db/seed/seed-data.ts</code>. This script contains the logic to create and insert initial data into the database.</p>

<h4>2.3. Seeding Script</h4>
<p>The seeding script uses the <code>EntityManager</code> from TypeORM to interact with the database. Below is an example of how users, artists, and playlists are seeded:</p>

<pre><code>import { Artist } from 'src/entities/artist.entity';
import { User } from 'src/entities/user.entity';
import { EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuid4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { Playlist } from 'src/entities/playlist.entity';

export const seedData = async (manager: EntityManager): Promise<void> => {
  // Seeding logic here
};
</code></pre>

<h4>2.4. Running the Seeding Script</h4>
<p>The seeding script is executed during the application startup. The <code>SeedService</code> is responsible for handling the seeding process.</p>

<p>The <code>SeedService</code> is implemented as follows:</p>

<pre><code>import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedData } from '../../db/seed/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly connection: DataSource) {}

  async seed(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      await seedData(manager);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('Error during database seeding:', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
</code></pre>

<h4>2.5. Integrating Seeding in the Application</h4>
<p>In your application’s <code>bootstrap</code> function, you can trigger the seeding process:</p>

<pre><code>import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());
  const seedService = app.get(SeedService);
  await seedService.seed();
  await app.listen(3000);
}
bootstrap();
</code></pre>

<p>This setup ensures that the seeding process is automatically executed when the application starts.</p>

<h3>3. Conclusion</h3>
<p>With migrations and seeding in place, your database can be easily managed and populated with initial data, ensuring consistency and making the development process smoother.</p>
