import { SetMetadata } from '@nestjs/common';
import { RoleModule } from '../role.module';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
