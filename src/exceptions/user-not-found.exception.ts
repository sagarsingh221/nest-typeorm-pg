import { NotFoundException } from '@nestjs/common';
import { Messages } from '@src/commons/constants/messages.constant';
export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(Messages.USER.DOES_NOT_EXIST);
  }
}
