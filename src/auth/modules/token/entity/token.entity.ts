import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TokenModel } from '../model/token.model';

@Entity({ name: 'token' })
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column({ name: 'access_token' })
  accessToken!: string;

  @Column({ name: 'refresh_token' })
  refreshToken!: string;

  @Column({ name: 'expired_date' })
  expiresAt!: Date;

  @Column({ name: 'refresh_expires_at' })
  refreshExpiresAt!: Date;

  @Column({ name: 'is_revoked' })
  isRevoked!: boolean;

  @Column({ name: 'user_agent' })
  userAgent?: string;

  @Column({ name: 'ip_address' })
  ipAddress?: string;

  @Column({ name: 'session_id' })
  sessionId?: string;

  @Column({ name: 'last_used_at' })
  lastUsedAt?: Date;

  @Column({ name: 'created_at' })
  createdAt?: Date;

  @Column({ name: 'created_by' })
  createdBy?: number;

  @Column({ name: 'updated_at' })
  updatedAt?: Date;

  @Column({ name: 'updated_by' })
  updatedBy?: number;

  @Column({ name: 'deleted_at' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by' })
  deletedBy?: number;

  toModel(): TokenModel {
    return new TokenModel(
      this.id,
      this.accountId,
      this.accessToken,
      this.refreshToken,
      this.expiresAt,
      this.refreshExpiresAt,
      this.isRevoked,
      this.userAgent,
      this.ipAddress,
      this.sessionId,
      this.lastUsedAt,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
