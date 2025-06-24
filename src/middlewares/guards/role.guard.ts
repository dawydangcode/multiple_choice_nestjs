import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountService } from '../../account/account.service';
import { Role } from 'src/role/enum/role.enum';
import { ROLES_KEY } from 'src/role/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accountService: AccountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      console.log('No user found in request');
      return false;
    }

    try {
      const account = await this.accountService.getAccount(
        Number(user.accountId),
      );
      console.log(
        'User roleId:',
        account.roleId,
        'Required roles:',
        requiredRoles,
      );

      const userRoleId = Number(account.roleId);

      return requiredRoles.includes(userRoleId);
    } catch (error) {
      console.error('Error fetching account:', error);
      return false;
    }
  }
}
