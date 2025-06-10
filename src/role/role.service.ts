import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from './models/role.model';
import { RoleEntity } from './entities/role.entity';
import { throwError } from 'rxjs';
import { error } from 'console';

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

  async getById(roleId: number): Promise<RoleModel> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    if (!role) {
      throw new error('Role not found!');
    }
    return role.toModel();
  }

  async create(name: string): Promise<RoleEntity> {
    if (!name || name.trim() === '') {
      throw new Error('Role name must not be empty!');
    }
    const entity = new RoleEntity();
    entity.name = name;
    entity.createdAt = new Date();
    entity.createdBy = 1;
    return await this.roleRepository.save(entity);
  }

  async update(
    role: RoleModel,
    id: number,
    name: string,
  ): Promise<RoleModel | null> {
    await this.roleRepository.update(id, {
      name,
      updatedAt: new Date(),
      updatedBy: 1,
    });

    return await this.roleRepository.findOne({
      where: { id: role.id, deletedAt: IsNull() },
    });
  }

  async delete(roleId: number): Promise<RoleEntity | null> {
    await this.roleRepository.update(
      {
        id: roleId,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: 1,
      },
    );
    return await this.roleRepository.findOne({ where: { id: roleId } });
  }
}
