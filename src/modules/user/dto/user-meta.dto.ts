import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UserMetaDto {
  // Todo: add validations here
  lastLoginAt: Date;

  lastFailedLoginAt: Date;

  lastLogoutAt: Date;

  // constructor(userAuth: UserAuthEntity) {
  //   super(userAuth);
  //   this.pinCode = userAuth.pinCode;
  //   this.lastSuccessfulLoggedDate = userAuth.lastSuccessfulLoggedDate;
  //   this.lastFailedLoggedDate = userAuth.lastFailedLoggedDate;
  //   this.lastLogoutDate = userAuth.lastLogoutDate;
  // }
}
