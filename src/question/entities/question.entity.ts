import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionModel } from '../models/question.model';

@Entity('exam_question')
export class QuestionEntity {
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

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  toModel(): QuestionModel {
    return new QuestionModel(
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
