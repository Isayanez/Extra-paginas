import {
  applyDecorators,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserRoleGuard } from '../../guards/user-role/user-role.guard.js';
export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(
      AuthGuard('jwt'),
      UserRoleGuard,
    ),
  );
}