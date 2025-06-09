import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExamQuestion } from "./ExamQuestion";
import { PickExam } from "./PickExam";

@Entity("exam", { schema: "multiple_choice" })
export class Exam {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("text", { name: "title", nullable: true })
  title: string | null;

  @Column("time", { name: "minute_duration", nullable: true })
  minuteDuration: string | null;

  @Column("tinyint", { name: "is_active", nullable: true, width: 1 })
  isActive: boolean | null;

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

  @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.exam)
  examQuestions: ExamQuestion[];

  @OneToMany(() => PickExam, (pickExam) => pickExam.exam)
  pickExams: PickExam[];
}
