import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableVersioning();

  const seedService = app.get(SeedService);
  await seedService.seedAdminUser();

  await app.listen(3001, () => console.log('LaveCAR API running on PORT 3001'));
}
bootstrap();
