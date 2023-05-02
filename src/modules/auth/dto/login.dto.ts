import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'sagar.singh@salary.com',
    description: 'email for the user',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: '@Passssword',
    description: "User's password for above email",
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
