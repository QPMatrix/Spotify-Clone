<h1>📄 Setting Up Swagger in NestJS</h1>

<h3>1. Overview</h3>
<p>Swagger provides an easy way to document and test your API endpoints. In NestJS, integrating Swagger is straightforward and can greatly enhance the development process by providing a user-friendly interface to interact with your API.</p>

<h3>2. Installing Necessary Packages</h3>
<p>To add Swagger to your NestJS project, you need to install the Swagger module:</p>

<pre><code>pnpm add @nestjs/swagger swagger-ui-express</code></pre>

<h3>3. Configuring Swagger</h3>

<h4>3.1. Setting Up Swagger in <code>main.ts</code></h4>
<p>In your <code>main.ts</code> file, configure Swagger by adding the following code:</p>

<pre><code>import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Spotify Clone API')
    .setDescription('API documentation for the Spotify Clone application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}

bootstrap();
</code></pre>

<p>This setup initializes Swagger with a basic configuration, including a title, description, version, and bearer authentication. The Swagger UI will be accessible at <code>http://localhost:3000/api/docs</code>.</p>

<h4>3.2. Decorating Controllers and Methods</h4>
<p>To document your API endpoints, you can use Swagger decorators in your controllers and methods. Below is an example of how to apply these decorators to a controller:</p>

<pre><code>import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createUserDto: CreateUserDto) {
    return 'User created';
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return user profile.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getProfile() {
    return 'User profile';
  }
}
</code></pre>

<p>The <code>@ApiTags</code> decorator is used to group endpoints under a specific tag in the Swagger UI. The <code>@ApiOperation</code> and <code>@ApiResponse</code> decorators provide metadata about each endpoint, such as its purpose and possible responses.</p>

<h3>4. Enhancing Swagger Documentation</h3>

<h4>4.1. Documenting DTOs</h4>
<p>You can also document your Data Transfer Objects (DTOs) using Swagger decorators. For example:</p>

<pre><code>import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  email: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  password: string;
}
</code></pre>

<p>The <code>@ApiProperty</code> decorator adds metadata to the DTO properties, which will be displayed in the Swagger UI.</p>

<h3>5. Conclusion</h3>
<p>Integrating Swagger into your NestJS application provides a powerful way to document and interact with your API. By following this setup, you can ensure that your API is well-documented and easy to use for both development and production environments.</p>
