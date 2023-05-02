import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'user.create',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'For Creating User',
  })
  @IsString()
  @IsOptional()
  readonly description: string;
}
