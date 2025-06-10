import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from './models/role.model';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async getAll(): Promise<RoleModel[]> {
    const roles = await this.roleRepository.find();
    return roles.map((role: RoleEntity) => role.toModel());
  }
}
