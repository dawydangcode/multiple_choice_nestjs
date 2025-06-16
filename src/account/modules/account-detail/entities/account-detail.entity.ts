import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccountDetailModel } from '../models/account-detail.model';
import { GenderType } from '../enums/gender.type';

@Entity('account_detail')
export class AccountDetailEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column({ name: 'name' })
  name?: string;

  @Column({ name: 'dob' })
  dob?: string;

  @Column({ name: 'gender' })
  gender?: GenderType;

  @Column({ name: 'image_url' })
  imageUrl?: string;

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

  toModel(): AccountDetailModel {
    return new AccountDetailModel(
      this.id,
      this.accountId,
      this.name,
      this.dob,
      this.gender,
      this.imageUrl,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
