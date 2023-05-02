import { SeederModule } from '@modules/seeder';
import { NestFactory } from '@nestjs/core';
import { SeederService } from '@modules/seeder/services';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const seeder = appContext.get(SeederService);
      console.log('Seeding Started!');
      seeder
        .seed()
        .then(() => {
          console.log('Seeding Completed!');
        })
        .catch((error) => {
          console.log('Seeding Failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();
