import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleBodyDto } from './dtos/role.dto';

@Controller('api/v1')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('roles')
  async getAllRole() {
    return this.roleService.getAll();
  }

  @Post('role/create')
  async createRole(@Body() body: CreateRoleBodyDto) {
    return await this.roleService.create(body.name);
  }

  @Put('role/:roleId/update')
  async updateRole(@Param() params: any, @Body() body: any) {
    await this.roleService.update(
      { id: params.roleId, name: body.name },
      params.roleId,
      body.name,
    );
    return await this.roleService.getById(params.roleId);
  }

  @Delete('role/:roleId/delete')
  async deleteRole(@Param() params: any) {
    await this.roleService.delete(params.roleId);
    return { message: 'Role deleted successfully' };
  }
}
