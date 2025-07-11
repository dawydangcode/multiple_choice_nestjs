import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PickExamDetailModel } from '../models/pick-exam-deltail.model';

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

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

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
