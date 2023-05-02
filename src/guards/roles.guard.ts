import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayloadDto } from '@modules/auth/dto';
import { ROLES_KEY } from '@src/decorators';
import { isPublicRoute } from '@guards/auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (isPublicRoute(this._reflector, context)) {
      return true;
    }

    const rolesToCheck = this._reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const { roles } = <JwtPayloadDto>request.user;

    if (roles.length === 0) {
      return true;
    }

    return roles.some((role) => rolesToCheck.includes(role));
  }
}
