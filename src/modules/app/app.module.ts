import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { AuthModuleOptions } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtAuthGuard, RolesGuard } from '@src/guards';
import { AuthModule } from '@src/modules/auth';
import { PermissionModule } from '@src/modules/permission';
import { RoleModule } from '@src/modules/role';
import { UserModule } from '@src/modules/user';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { DatabaseModule } from '../database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { routes } from './routes';

@Module({
  imports: [
    RouterModule.register(routes),
    ScheduleModule.forRoot(),
    PermissionModule,
    RoleModule,
    UserModule,
    AuthModule,
    MorganModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthModuleOptions,
  ],
})
export class AppModule {
  static port: number;
  static hostname: string;
  static isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    AppModule.port =
      Number(process.env.PORT) || this.configService.get('APP_PORT');
    AppModule.hostname = this.configService.get('APP_URL');
    AppModule.isProduction =
      this.configService.get('NODE_ENV') === 'production';
  }
}
