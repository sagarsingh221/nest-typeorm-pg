import { Module } from '@nestjs/common';
import { SeederService } from '@modules/seeder/services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '@utils/strategies';
import { RoleEntity } from '@modules/role/entities';
import { UserEntity, UserMeta } from '@modules/user/entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        synchronize: false,
        entities: ['src/**/*.entity{.ts,.js,.d.ts}'],
        migrationsRun: false,
        logging: true,
        namingStrategy: new SnakeNamingStrategy(),
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
    TypeOrmModule.forFeature([RoleEntity, UserMeta, UserEntity]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
