import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AccountModel } from '../models/account.model';
import { RoleEntity } from 'src/role/entities/role.entity';

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: number;

  @Column('varchar', { name: 'user_name' })
  username!: string;

  @Column('varchar', { name: 'password' })
  password!: string;

  @Column({ name: 'email' })
  email!: string;

  @Column('bigint', { name: 'role_id' })
  roleId!: number;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt!: Date | undefined;

  @Column('bigint', { name: 'created_by', nullable: true })
  createdBy!: number | undefined;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt!: Date | undefined;

  @Column('bigint', { name: 'updated_by', nullable: true })
  updatedBy!: number | undefined;

  @Column('timestamp', { name: 'deleted_at', nullable: true })
  deletedAt!: Date | undefined;

  @Column('bigint', { name: 'deleted_by', nullable: true })
  deletedBy!: number | undefined;

  @ManyToOne(() => RoleEntity, (role) => role.accounts, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: RoleEntity | undefined;

  toModel(): AccountModel {
    return new AccountModel(
      this.id,
      this.username,
      this.password,
      this.email,
      this.roleId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
