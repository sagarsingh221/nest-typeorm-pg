import { RoleModule } from '@modules/role';
import { RoleEntity } from '@modules/role/entities';
import { UserController } from '@modules/user/controllers';
import { UserEntity, UserMeta } from '@modules/user/entities';
import { UserMetaService, UserService } from '@modules/user/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '@src/guards';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    NestjsFormDataModule,
    RoleModule,
    TypeOrmModule.forFeature([
      UserEntity,
      UserMeta,
      RoleEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserMetaService, RolesGuard],
  exports: [UserService, UserMetaService],
})
export class UserModule {}
