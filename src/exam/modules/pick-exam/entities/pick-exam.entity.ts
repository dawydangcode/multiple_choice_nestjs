import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PickExamModel } from '../models/pick-exam.model';
import { PickExamType } from '../enum/pick-exam.type';
import { ExamEntity } from 'src/exam/entities/exam.entity';
import { UserEntity } from 'src/account/modules/user/entity/user.entity';
import { PickExamDetailEntity } from '../../pick-exam-detail/entities/pick-exam-detail.entity';

@Entity('pick_exam')
export class PickExamEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'exam_id' })
  examId!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'status' })
  status!: PickExamType;

  @Column({ name: 'start_time' })
  startTime!: Date;

  @Column({ name: 'end_time' })
  endTime!: Date;

  @Column({ name: 'finish_time' })
  finishTime!: Date;

  @Column({ name: 'total_questions' })
  totalQuestions!: number;

  @Column({ name: 'correct_answers' })
  correctAnswers!: number;

  @Column({ name: 'score' })
  score!: number;

  @Column({ name: 'percentage' })
  percentage!: number;

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

  @ManyToOne(() => ExamEntity, (exam) => exam.pickExams)
  @JoinColumn({ name: 'exam_id' })
  exam?: ExamEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(
    () => PickExamDetailEntity,
    (pickExamDetail) => pickExamDetail.pickExam,
  )
  pickExamDetails?: PickExamDetailEntity[];

  toModel(): PickExamModel {
    return new PickExamModel(
      this.id,
      this.userId,
      this.examId,
      this.status,
      this.startTime,
      this.endTime,
      this.finishTime,
      this.totalQuestions,
      this.correctAnswers,
      this.score,
      this.percentage,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
