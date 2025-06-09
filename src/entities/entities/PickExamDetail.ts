import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PickExam } from "./PickExam";
import { Question } from "./Question";
import { Answer } from "./Answer";

@Index("pick_exam_id", ["pickExamId"], {})
@Index("question_id", ["questionId"], {})
@Index("answer_id", ["answerId"], {})
@Entity("pick_exam_detail", { schema: "multiple_choice" })
export class PickExamDetail {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "pick_exam_id", nullable: true })
  pickExamId: string | null;

  @Column("bigint", { name: "question_id", nullable: true })
  questionId: string | null;

  @Column("bigint", { name: "answer_id", nullable: true })
  answerId: string | null;

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

  @ManyToOne(() => PickExam, (pickExam) => pickExam.pickExamDetails, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "pick_exam_id", referencedColumnName: "id" }])
  pickExam: PickExam;

  @ManyToOne(() => Question, (question) => question.pickExamDetails, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "question_id", referencedColumnName: "id" }])
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.pickExamDetails, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "answer_id", referencedColumnName: "id" }])
  answer: Answer;
}
