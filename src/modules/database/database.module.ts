import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from '../../utils/strategies';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        synchronize: false,
        entities: ['dist/**/*.entity{.ts,.js}'],
        subscribers: ['dist/**/*.subscriber{.ts,.js}'],
        migrations: ['dist/**/migrations/*.js'],
        migrationsRun: true,
        logging: true,
        namingStrategy: new SnakeNamingStrategy(),
        migrationsTransactionMode: 'each',
        extra:
          configService.get('NODE_ENV') === 'heroku'
            ? {
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {},
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
