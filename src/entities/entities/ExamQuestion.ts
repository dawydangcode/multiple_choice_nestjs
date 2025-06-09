import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Exam } from "./Exam";
import { Question } from "./Question";

@Index("exam_id", ["examId"], {})
@Index("question_id", ["questionId"], {})
@Entity("exam_question", { schema: "multiple_choice" })
export class ExamQuestion {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "exam_id", nullable: true })
  examId: string | null;

  @Column("bigint", { name: "question_id", nullable: true })
  questionId: string | null;

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

  @ManyToOne(() => Exam, (exam) => exam.examQuestions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "exam_id", referencedColumnName: "id" }])
  exam: Exam;

  @ManyToOne(() => Question, (question) => question.examQuestions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "question_id", referencedColumnName: "id" }])
  question: Question;
}
