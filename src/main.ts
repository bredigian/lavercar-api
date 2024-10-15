import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableVersioning();

  await app.listen(3001, () => console.log('LaveCAR API running on PORT 3001'));
}
bootstrap();
