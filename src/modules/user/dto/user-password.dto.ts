import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { passwordRegex } from '@commons/constants';

export class UserPasswordDto {
  @ApiProperty({
    example: '@Password1',
    description: "User's unique password",
  })
  @Matches(passwordRegex, { message: 'Password too weak' })
  readonly password: string;
}
