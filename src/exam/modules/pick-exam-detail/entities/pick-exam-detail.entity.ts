import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PickExamDetailModel } from '../models/pick-exam-detail.model';
import { PickExamEntity } from '../../pick-exam/entities/pick-exam.entity';
import { QuestionEntity } from 'src/question/entities/question.entity';
import { AnswerEntity } from 'src/question/modules/answer/entities/answer.entity';

@Entity('pick_exam_detail')
export class PickExamDetailEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'pick_exam_id' })
  pickExamId!: number;

  @Column({ name: 'question_id' })
  questionId!: number;

  @Column({ name: 'answer_id' })
  answerId!: number;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  @ManyToOne(() => PickExamEntity, (pickExam) => pickExam.pickExamDetails)
  @JoinColumn({ name: 'pick_exam_id' })
  pickExam?: PickExamEntity;

  @ManyToOne(() => QuestionEntity, (question) => question.pickExamDetails)
  @JoinColumn({ name: 'question_id' })
  question?: QuestionEntity;

  @ManyToOne(() => AnswerEntity, (answer) => answer.pickExamDetails)
  @JoinColumn({ name: 'answer_id' })
  answer?: AnswerEntity;

  toModel(): PickExamDetailModel {
    return new PickExamDetailModel(
      this.id,
      this.pickExamId,
      this.questionId,
      this.answerId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
