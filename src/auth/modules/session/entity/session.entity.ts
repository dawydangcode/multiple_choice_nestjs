import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SessionModel } from '../model/session.model';

@Entity('session')
export class SessionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column({ name: 'access_token' })
  accessToken!: string;

  @Column({ name: 'refresh_token' })
  refreshToken!: string;

  @Column({ name: 'expires_at' })
  accessExpire!: Date;

  @Column({ name: 'refresh_expires_at' })
  refreshExpire!: Date;

  @Column({ name: 'user_agent' })
  userAgent!: string;

  @Column({ name: 'ip_address' })
  ipAddress!: string;

  @Column({ name: 'is_active' })
  isActive!: boolean;

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

  toModel(): SessionModel {
    return new SessionModel(
      this.id,
      this.accountId,
      this.accessToken,
      this.refreshToken,
      this.accessExpire,
      this.refreshExpire,
      this.isActive,
      this.userAgent,
      this.ipAddress,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
