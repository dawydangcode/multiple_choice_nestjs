import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Answer } from "./Answer";
import { ExamQuestion } from "./ExamQuestion";
import { PickExamDetail } from "./PickExamDetail";
import { Topic } from "./Topic";

@Index("topic_id", ["topicId"], {})
@Entity("question", { schema: "multiple_choice" })
export class Question {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "topic_id", nullable: true })
  topicId: string | null;

  @Column("text", { name: "ques_content", nullable: true })
  quesContent: string | null;

  @Column("float", { name: "points", nullable: true, precision: 12 })
  points: number | null;

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

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.question)
  examQuestions: ExamQuestion[];

  @OneToMany(() => PickExamDetail, (pickExamDetail) => pickExamDetail.question)
  pickExamDetails: PickExamDetail[];

  @ManyToOne(() => Topic, (topic) => topic.questions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "topic_id", referencedColumnName: "id" }])
  topic: Topic;
}
