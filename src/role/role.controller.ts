import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleBodyDto } from './dtos/role.dto';

@Controller('api/v1/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('')
  async getAllRole() {
    return this.roleService.getAll();
  }

  @Post('create')
  async createRole(@Body() body: CreateRoleBodyDto) {
    return this.roleService.create(body.name);
  }

  @Put(':roleId/update')
  async updateRole(@Param() params: any, @Body() body: any) {
    await this.roleService.update(
      { id: params.roleId, name: body.name },
      params.roleId,
      body.name,
    );
    return this.roleService.getById(params.roleId);
  }

  @Delete(':roleId/delete')
  async deleteRole(@Param() params: any) {
    await this.roleService.delete(params.roleId);
    return { message: 'Role deleted successfully' };
  }
}
