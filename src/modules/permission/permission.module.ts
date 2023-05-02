import { PermissionController } from '@modules/permission/controllers';
import { PermissionEntity } from '@modules/permission/entities';
import { PermissionService } from '@modules/permission/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
