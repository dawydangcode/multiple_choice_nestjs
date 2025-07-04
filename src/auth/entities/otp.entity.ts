import { PickType } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('opt_verifcation')
export class OtpEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column({ name: 'email' })
  email!: string;

  @Column({ name: 'otp_code' })
  otpCode!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'expires_at' })
  expiresAt!: Date;

  @Column({ name: 'is_use' })
  isUse!: boolean;
}
