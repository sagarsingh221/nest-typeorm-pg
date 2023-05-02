import { PermissionModule } from '@modules/permission';
import { RoleController } from '@modules/role/controllers';
import { RoleEntity } from '@modules/role/entities';
import { RoleService } from '@modules/role/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [PermissionModule, TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
