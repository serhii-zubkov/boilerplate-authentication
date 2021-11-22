import {
  Injectable,
  applyDecorators,
  UseGuards,
  SetMetadata,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'constants/index';
import { JwtAuthGuard } from 'modules/common/auth/jwt-auth.guard';

@Injectable()
export class AllRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user.hasAllRoles(roles);
  }
}

@Injectable()
export class OneOfRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user.hasOneOfRoles(roles);
  }
}

@Injectable()
export class OwnerOrRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.hasOneOfRoles(roles)) {
      return true;
    }

    if (request.body.userId || request.params.userId) {
      if (
        request.body.userId == user.userId ||
        request.params.userId == user.userId
      ) {
        return true;
      }
    }

    return false;
  }
}

export function AllRoles(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, AllRolesGuard),
  );
}

export function OneOfRoles(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, OneOfRolesGuard),
  );
}

export function OwnerOrRoles(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, OwnerOrRolesGuard),
  );
}
