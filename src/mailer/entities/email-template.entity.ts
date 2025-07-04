import { cp } from 'fs';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_template')
export class EmailTemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'html' })
  html!: string;

  @Column({ name: 'subject' })
  subject!: string;

  @Column({ name: 'description' })
  description!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @Column({ name: 'deteled_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;
}
