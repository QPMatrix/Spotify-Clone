<h1>📄 Environment Configuration Setup</h1>

<h3>1. Overview</h3>
<p>Environment configuration is crucial for managing different settings for development, testing, and production environments. NestJS provides powerful tools to load and validate environment variables, ensuring your application is configured correctly and securely.</p>

<h3>2. Setting Up Environment Variables</h3>

<h4>2.1. Creating the <code>.env</code> File</h4>
<p>Create a <code>.env</code> file in the root of your project to store your environment variables. This file should not be committed to version control (e.g., Git) for security reasons. Here's an example:</p>

<pre><code># .env
PORT=
JWT_SECRET=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
NODE_ENV=development
</code></pre>

<h4>2.2. Installing Necessary Packages</h4>
<p>To work with environment variables in NestJS, you need to install the following packages:</p>

<pre><code>pnpm add @nestjs/config class-transformer class-validator</code></pre>

<p>These packages provide the functionality to load, parse, and validate environment variables.</p>

<h3>3. Configuring the Application</h3>

<h4>3.1. Creating a Configuration Module</h4>
<p>Create a <code>config</code> directory in your <code>src</code> folder and add a <code>config.ts</code> file to define the configuration structure:</p>

<pre><code>import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

enum ENV {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvVariables {
  @IsEnum(ENV)
  NODE_ENV: ENV;

  @IsNumber()
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true, // This option allows automatic type conversion
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
</code></pre>

<p>This setup will load and validate the environment variables based on the <code>EnvVariables</code> class definition.</p>

<h4>3.2. Integrating Configuration in the <code>AppModule</code></h4>
<p>In your <code>AppModule</code>, use the <code>ConfigModule</code> to load and validate environment variables:</p>

<pre><code>import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'], // Adjust the file path based on your environment
      validate,
      isGlobal: true, // Makes ConfigModule available globally
    }),
    // Other modules...
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
</code></pre>

<p>This configuration ensures that the environment variables are loaded, validated, and accessible throughout your application.</p>

<h3>4. Conclusion</h3>
<p>By following this setup, you ensure that your application is properly configured and that environment variables are validated, reducing the risk of misconfiguration and enhancing the security of your application.</p>
