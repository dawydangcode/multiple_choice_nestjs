import { Role } from 'src/role/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AccountModel } from '../models/account.model';

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('varchar', { name: 'user_name' })
  userName: string;

  @Column('varchar', { name: 'password' })
  password: string;

  @Column('bigint', { name: 'role_id' })
  roleId: number;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt: Date | undefined;

  @Column('bigint', { name: 'created_by', nullable: true })
  createdBy: string | undefined;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | undefined;

  @Column('bigint', { name: 'updated_by', nullable: true })
  updatedBy: string | undefined;

  @Column('timestamp', { name: 'deleted_at', nullable: true })
  deletedAt: Date | undefined;

  @Column('bigint', { name: 'deleted_by', nullable: true })
  deletedBy: string | undefined;

  @ManyToOne(() => Role, (role) => role.accounts, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Role | undefined;

  toModel(): AccountModel {
    return new AccountModel(this.id, this.userName, this.password, this.roleId);
  }
}
