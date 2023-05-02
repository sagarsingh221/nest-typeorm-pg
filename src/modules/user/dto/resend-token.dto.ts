import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResendTokenDto {
  @ApiProperty()
  @IsString()
  readonly token: string;
}
