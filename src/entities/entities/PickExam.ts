import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Exam } from "./Exam";
import { PickExamDetail } from "./PickExamDetail";

@Index("user_id", ["userId"], {})
@Index("exam_id", ["examId"], {})
@Entity("pick_exam", { schema: "multiple_choice" })
export class PickExam {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "user_id", nullable: true })
  userId: string | null;

  @Column("bigint", { name: "exam_id", nullable: true })
  examId: string | null;

  @Column("time", { name: "start_time", nullable: true })
  startTime: string | null;

  @Column("time", { name: "finish_time", nullable: true })
  finishTime: string | null;

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

  @ManyToOne(() => User, (user) => user.pickExams, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(() => Exam, (exam) => exam.pickExams, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "exam_id", referencedColumnName: "id" }])
  exam: Exam;

  @OneToMany(() => PickExamDetail, (pickExamDetail) => pickExamDetail.pickExam)
  pickExamDetails: PickExamDetail[];
}
