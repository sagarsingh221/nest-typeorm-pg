import { AddUserRolesDto } from '@modules/role/dto';
import { PickType } from '@nestjs/swagger';

export class RemoveUserRolesDto extends PickType(AddUserRolesDto, [
  'userUuid',
  'rolesUuids',
]) {}
