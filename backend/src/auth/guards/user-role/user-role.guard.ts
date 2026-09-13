import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../entities/user.entity.js';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const validRoles =
      this.reflector.getAllAndOverride<string[]>(
        'roles',
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!validRoles || validRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      return false;
    }

    return validRoles.some((role) =>
      user.roles.includes(role),
    );
  }
}