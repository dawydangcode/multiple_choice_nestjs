import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../model/user.model';
import { AccountModel } from 'src/account/models/account.model';
import { AccountDetailModel } from '../../account-detail/models/account-detail.model';
import { IsOptional } from 'class-validator';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column({ name: 'cv_url', nullable: true })
  cvUrl?: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  toModel(): UserModel {
    return new UserModel(
      this.id,
      this.accountId,
      this.cvUrl,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
