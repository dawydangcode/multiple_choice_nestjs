import { AccountEntity } from 'src/account/entities/account.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role', { schema: 'multiple_choice' })
export class Role {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ type: 'bigint', name: 'name' })
  name: string;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt: Date;

  @Column('bigint', { name: 'created_by', nullable: true })
  createdBy: string;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column('bigint', { name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column('timestamp', { name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @Column('bigint', { name: 'deleted_by', nullable: true })
  deletedBy: string;

  @OneToMany(() => AccountEntity, (account) => account.role)
  accounts: AccountEntity[];
}
