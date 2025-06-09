import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./Question";
import { PickExamDetail } from "./PickExamDetail";

@Index("question_id", ["questionId"], {})
@Entity("answer", { schema: "multiple_choice" })
export class Answer {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "question_id", nullable: true })
  questionId: string | null;

  @Column("text", { name: "ans_content", nullable: true })
  ansContent: string | null;

  @Column("tinyint", { name: "is_correct", nullable: true, width: 1 })
  isCorrect: boolean | null;

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

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "question_id", referencedColumnName: "id" }])
  question: Question;

  @OneToMany(() => PickExamDetail, (pickExamDetail) => pickExamDetail.answer)
  pickExamDetails: PickExamDetail[];
}
