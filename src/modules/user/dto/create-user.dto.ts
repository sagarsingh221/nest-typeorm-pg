import { UserEmailDto } from '@modules/user/dto/user-email.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto extends UserEmailDto {
  @ApiProperty({
    example: 'Nick',
    description: "User's first name",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(80)
  readonly firstName: string;

  @ApiProperty({
    example: 'Allen',
    description: "User's last name",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(80)
  readonly lastName: string;

  @ApiProperty({
    example: '1',
    description: 'Admin account id',
  })
  @IsOptional()
  @IsNumber()
  accountId?: number;

  @ApiProperty({
    example:
      '["051d7e78-1b5a-4927-a692-10bd77ca9240", "38427841-036d-4976-a74f-d836babaeb98"]',
    description: 'role uuids to attach with user and they are optional',
  })
  @IsArray()
  @IsUUID(4, { each: true })
  roleUuids?: string[];

  @ApiProperty({ example: '123456789111', description: 'Phone' })
  @IsString()
  @MinLength(10)
  readonly phone: string;
}
