import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { AccountEntity } from 'src/account/entities/account.entity';
import { VerificationTokenModel } from '../models/verify-token.model';

@Entity('verification_token')
export class VerificationTokenEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'account_id' })
  account_id!: number;

  @Column({ name: 'email' })
  email!: string;

  @Column({ name: 'token' })
  token!: string;

  @Column({ name: 'ip_address' })
  ipAddress!: string;

  @Column({ name: 'user_agent' })
  userAgent!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'expires_at' })
  expiresAt!: Date;

  @Column({ name: 'is_used' })
  isUsed!: boolean;

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  toModel(): VerificationTokenModel {
    return new VerificationTokenModel(
      this.id,
      this.account_id,
      this.email,
      this.token,
      this.ipAddress,
      this.userAgent,
      this.isUsed,
      this.createdAt,
      this.expiresAt,
      this.deletedAt,
    );
  }
}
