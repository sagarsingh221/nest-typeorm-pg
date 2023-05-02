import { InternalServerErrorException } from '@nestjs/common';
import { Messages } from '@src/commons/constants';

export class ServerFailedException extends InternalServerErrorException {
  constructor() {
    super(Messages.SERVER_ERROR);
  }
}
