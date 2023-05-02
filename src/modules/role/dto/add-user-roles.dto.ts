import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddUserRolesDto {
  @ApiProperty({
    example: '0e77920e-8c3e-4d87-bed5-62f80ddf151c',
    description: 'uuid of user to whom you want to assign role/roles',
  })
  @IsUUID()
  readonly userUuid: string;

  @ApiProperty({
    example: '["a9114f79-f867-4de8-ab42-a4c749839123"]',
    description: 'Array of uuids of role/roles you want to assign or unassign',
  })
  @IsUUID(4, { each: true })
  readonly rolesUuids: string[];
}
