import { SnakeNamingStrategy } from './src/utils/strategies';

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  subscribers: ['dist/**/*.subscriber{.ts,.js}'],
  migrations: ['dist/**/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  logging: true,
  synchronize: false,
  migrationsTransactionMode: 'each',
  namingStrategy: new SnakeNamingStrategy(),
};
