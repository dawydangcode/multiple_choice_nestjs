import { AccountEntity } from 'src/account/entities/account.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleModel } from '../models/role.model';

@Entity('role', { schema: 'multiple_choice' })
export class RoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt: Date;

  @Column('bigint', { name: 'created_by', nullable: true })
  createdBy: string;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column('bigint', { name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column('timestamp', { name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @Column('bigint', { name: 'deleted_by', nullable: true })
  deletedBy: string;

  @OneToMany(() => AccountEntity, (account) => account.role)
  accounts: AccountEntity[];

  toModel(): RoleModel {
    return new RoleModel(this.id, this.name);
  }
}
