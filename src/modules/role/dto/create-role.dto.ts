import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    type: String,
    example: 'Admin',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    example: 'Admin can access these permissions',
  })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({
    type: [String],
    example: [
      '9f31ef18-a840-44eb-907e-47d9bf2974a1',
      'a127b096-09e2-4a19-bee4-c2b3ff7386d3',
    ],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  readonly permissionUuids: string;
}
