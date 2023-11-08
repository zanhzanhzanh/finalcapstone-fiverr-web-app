import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix Router
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({ origin: '*' });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Fiverr-Api')
    .setDescription('This API use for Final Capstone')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Enable Auto-Validation
  app.useGlobalPipes(new ValidationPipe());

  // // Config Passport
  // app.use(session({
  //   secret: 'thesecret',
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: { maxAge: 3600000 }
  // }))
  // app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
