import { AccountEntity } from 'src/account/entities/account.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleModel } from '../models/role.model';

@Entity('role', { schema: 'multiple_choice' })
export class RoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: number;

  @Column({ type: 'varchar', name: 'name' })
  name!: string;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt: Date | undefined;

  @Column('bigint', { name: 'created_by', nullable: true })
  createdBy: number | undefined;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | undefined;

  @Column('bigint', { name: 'updated_by', nullable: true })
  updatedBy: number | undefined;

  @Column('timestamp', { name: 'deleted_at', nullable: true })
  deletedAt: Date | undefined;

  @Column('bigint', { name: 'deleted_by', nullable: true })
  deletedBy: number | undefined;

  @OneToMany(() => AccountEntity, (account) => account.role)
  accounts: AccountEntity[] | undefined;

  toModel(): RoleModel {
    return new RoleModel(
      this.id,
      this.name,
      this.createdAt,
      this.createdBy,
      this.deletedAt,
      this.deletedBy,
      this.updatedAt,
      this.updatedBy,
    );
  }
}
