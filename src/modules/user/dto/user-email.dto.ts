import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserEmailDto {
  @ApiProperty({
    example: 'user@email.com',
    description: "User's email",
  })
  @IsEmail()
  readonly email: string;
}
