import { RoleType } from '@commons/constants';
import {
    ExecutionContext,
    Injectable, NotFoundException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from '@src/decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (isPublicRoute(this.reflector, context)) {
      return true;
    }

    return super.canActivate(context);
  }
}

export function isPublicRoute(reflector: Reflector, context: ExecutionContext) {
  const roles = reflector.getAllAndOverride<string[]>(ROLES_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  if (!roles) {
    throw new NotFoundException();
  }

  return roles.includes(RoleType.PUBLIC);
}
