import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PickExam } from "./PickExam";
import { Account } from "./Account";

@Index("account_id", ["accountId"], {})
@Entity("user", { schema: "multiple_choice" })
export class User {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "account_id", nullable: true })
  accountId: string | null;

  @Column("varchar", { name: "cv_url", nullable: true, length: 255 })
  cvUrl: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("bigint", { name: "created_by", nullable: true })
  createdBy: string | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("bigint", { name: "updated_by", nullable: true })
  updatedBy: string | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("bigint", { name: "deleted_by", nullable: true })
  deletedBy: string | null;

  @OneToMany(() => PickExam, (pickExam) => pickExam.user)
  pickExams: PickExam[];

  @ManyToOne(() => Account, (account) => account.users, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "account_id", referencedColumnName: "id" }])
  account: Account;
}
