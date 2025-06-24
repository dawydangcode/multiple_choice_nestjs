import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleIdType } from 'src/role/enum/role.enum';
import { ROLES_KEY } from 'src/role/decorator/roles.decorator';
import { isEmpty } from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleIdType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isEmpty(requiredRoles)) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return requiredRoles.includes(Number(user.roleId)); //check
  }
}
