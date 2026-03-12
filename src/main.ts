import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function main() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*'
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const varEnv = new ConfigService();
  await app.listen(varEnv.get('PORT') ?? 3000);
}
main();

