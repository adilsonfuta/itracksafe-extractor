import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function main() {
  const app = await NestFactory.create(AppModule);
  const varEnv = new ConfigService();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*'
  });
  
 await app.listen(varEnv.get('PORT') ?? 3000);
}
main();

