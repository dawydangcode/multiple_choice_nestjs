import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ExamQuestionModel } from '../models/exam-question.model';
import { ExamEntity } from '../../../entities/exam.entity';
import { QuestionEntity } from '../../../../question/entities/question.entity';

@Entity('exam_question')
export class ExamQuestionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'exam_id' })
  examId!: number;

  @Column({ name: 'question_id' })
  questionId!: number;

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

  @ManyToOne(() => ExamEntity, (exam) => exam.examQuestions)
  @JoinColumn({ name: 'exam_id' })
  exam?: ExamEntity;

  @ManyToOne(() => QuestionEntity, (question) => question.examQuestions)
  @JoinColumn({ name: 'question_id' })
  question?: QuestionEntity;

  toModel(): ExamQuestionModel {
    return new ExamQuestionModel(
      this.id,
      this.examId,
      this.questionId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
