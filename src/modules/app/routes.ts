import { PermissionModule } from '@modules/permission';
import { RoleModule } from '@src/modules/role';
import { UserModule } from '@src/modules/user';
import { Routes } from '@nestjs/core';
import { AuthModule } from '@src/modules/auth';

export const routes: Routes = [
  {
    path: '/permission',
    module: PermissionModule,
  },
  {
    path: '/role',
    module: RoleModule,
  },
  {
    path: '/auth',
    module: AuthModule,
  },
  {
    path: '/user',
    module: UserModule,
  },
];
