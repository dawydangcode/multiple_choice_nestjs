import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PickExamModel } from '../models/pick-exam.model';

@Entity('pick_exam')
export class PickExamEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'exam_id' })
  examId!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'start_time' })
  startTime!: Date;

  @Column({ name: 'finish_time' })
  finishTime!: Date;

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

  @OneToOne(() => PickExamModel, (pickExam) => pickExam.id)
  pickExamModel!: PickExamModel;

  toModel(): PickExamModel {
    return new PickExamModel(
      this.id,
      this.userId,
      this.examId,
      this.startTime,
      this.finishTime,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
