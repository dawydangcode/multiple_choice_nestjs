import { Role } from "src/role/role.entity";
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from "typeorm";

@Entity("account", { schema: "multiple_choice" })
export class Account{
    @PrimaryGeneratedColumn({type: "bigint", name: "id"})
    id: string;

    @Column("varchar", {name: "user_name", nullable: true, length: 255 })
    userName: string;

    @Column("varchar", {name: "password", nullable: true, length: 255})
    password: string;

    @Column("bigint", {name: "role_id", nullable: true})
    roleId: string;

    @Column("timestamp", {name: "created_at", nullable: true})
    createdAt: Date;

    @Column("bigint", {name: "created_by", nullable: true})
    createdBy: string;

    @Column("timestamp", {name: "updated_at", nullable: true})
    updatedAt: Date;

    @Column("bigint", {name: "updated_by", nullable: true})
    updatedBy: string;

    @Column("timestamp", {name: "deleted_at", nullable: true})
    deletedAt: Date;

    @Column("bigint", {name: "deleted_by", nullable: true})
    deletedBy: string;

    @ManyToOne(() => Role, (role) => role.accounts, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })

    @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
    role: Role;
}
