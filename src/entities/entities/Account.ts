import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";
import { AccountDetail } from "./AccountDetail";
import { Employee } from "./Employee";
import { User } from "./User";

@Index("role_id", ["roleId"], {})
@Entity("account", { schema: "multiple_choice" })
export class Account {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("varchar", { name: "user_name", nullable: true, length: 255 })
  userName: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 255 })
  password: string | null;

  @Column("bigint", { name: "role_id", nullable: true })
  roleId: string | null;

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

  @ManyToOne(() => Role, (role) => role.accounts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;

  @OneToMany(() => AccountDetail, (accountDetail) => accountDetail.account)
  accountDetails: AccountDetail[];

  @OneToMany(() => Employee, (employee) => employee.account)
  employees: Employee[];

  @OneToMany(() => User, (user) => user.account)
  users: User[];
}
