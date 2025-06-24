import { SetMetadata } from '@nestjs/common';
import { RoleIdType } from '../enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleIdType[]) => SetMetadata(ROLES_KEY, roles);
