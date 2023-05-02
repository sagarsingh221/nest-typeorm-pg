import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@modules/user/entities';

export const AuthUser = createParamDecorator(
  (data, req: ExecutionContext): UserEntity => {
    return req.switchToHttp().getRequest().user;
  },
);
