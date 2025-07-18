import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnswerModel } from '../models/answer.model';
import { QuestionEntity } from 'src/question/entities/question.entity';
import { PickExamDetailEntity } from 'src/exam/modules/pick-exam-detail/entities/pick-exam-deltail.entity';

@Entity('answer')
export class AnswerEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'question_id' })
  questionId!: number;

  @Column({ name: 'content' })
  content!: string;

  @Column({ name: 'is_correct' })
  isCorrect!: boolean;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  @ManyToOne(() => QuestionEntity, (question) => question.answers)
  @JoinColumn({ name: 'question_id' })
  question?: QuestionEntity;

  @OneToMany(
    () => PickExamDetailEntity,
    (pickExamDetail) => pickExamDetail.answer,
  )
  pickExamDetails?: PickExamDetailEntity[];

  toModel(): AnswerModel {
    return new AnswerModel(
      this.id,
      this.questionId,
      this.content,
      this.isCorrect,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
