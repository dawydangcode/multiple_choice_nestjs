import { OtpEntity } from '../entities/otp.entity';

export class OtpModel {
  public readonly accountId: number;
  public readonly email: string;
  public readonly expiresAt: Date;
  public readonly isUse: boolean;
  public readonly createdAt: Date;

  constructor(entity: OtpEntity) {
    this.accountId = entity.accountId;
    this.email = entity.email;
    this.expiresAt = entity.expiresAt;
    this.isUse = entity.isUse;
    this.createdAt = entity.createdAt;
  }
}
