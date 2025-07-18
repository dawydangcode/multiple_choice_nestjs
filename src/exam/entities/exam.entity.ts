import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { ExamModel } from '../models/exam.model';
import { ExamQuestionEntity } from '../modules/exam-question/entities/exam-question.entity';
import { PickExamEntity } from '../modules/pick-exam/entities/pick-exam.entity';
import { QuestionEntity } from 'src/question/entities/question.entity';

@Entity('exam')
export class ExamEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'title' })
  title!: string;

  @Column({ name: 'minute_duration' })
  minuteDuration!: number;

  @Column({ name: 'is_active' })
  isActive!: boolean;

  @Column({ name: 'description' })
  description!: string;

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

  @OneToMany(() => ExamQuestionEntity, (examQuestion) => examQuestion.exam)
  examQuestions?: ExamQuestionEntity[];

  @OneToMany(() => PickExamEntity, (pickExam) => pickExam.exam)
  pickExams?: PickExamEntity[];

  @ManyToMany(() => QuestionEntity, (question) => question.exams)
  questions?: QuestionEntity[];

  toModel(): ExamModel {
    return new ExamModel(
      this.id,
      this.title,
      this.minuteDuration,
      this.isActive,
      this.description,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
