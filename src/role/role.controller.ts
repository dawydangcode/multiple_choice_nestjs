import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleBodyDto } from './dtos/role.dto';

@Controller('api/v1/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('')
  async getAllRole(){
    return this.roleService.getAll();
  }

  @Post('create')
  async createRole(@Body() body: CreateRoleBodyDto){
    return this.roleService.create(body.name);
  }
  
}
