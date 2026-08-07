import 'reflect-metadata';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const uploadDir = join(process.cwd(), 'uploads');
  mkdirSync(uploadDir, { recursive: true });

  const allowedOrigins = new Set(
    (process.env.CORS_ORIGIN?.split(',').map((value) => value.trim()).filter(Boolean) ?? []).filter(Boolean),
  );

  [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:8080',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',
    'http://127.0.0.1:8080',
  ].forEach((origin) => allowedOrigins.add(origin));

  app.use(helmet());
  app.enableCors({
    origin: Array.from(allowedOrigins),
    credentials: true,
  });
  app.use('/uploads', express.static(uploadDir));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT ?? 4010);
  await app.listen(port);
  console.log(`DIASPORA IMO MATHIAM MBOW API disponible sur http://localhost:${port}/api`);
}

void bootstrap();
