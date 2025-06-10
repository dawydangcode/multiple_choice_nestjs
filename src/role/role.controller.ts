import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('api/v1/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
}
