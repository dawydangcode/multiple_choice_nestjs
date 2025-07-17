import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { QuestionModel } from '../models/question.model';
import { ExamQuestionEntity } from '../../exam/modules/exam-question/entities/exam-question.entity';

@Entity('question')
export class QuestionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'topic_id' })
  topicId!: number;

  @Column({ name: 'content' })
  content!: string;

  @Column({
    name: 'points',
    type: 'float',
    precision: 5,
    scale: 2,
  })
  points!: number;

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

  @OneToMany(() => ExamQuestionEntity, (examQuestion) => examQuestion.question)
  examQuestions?: ExamQuestionEntity[];

  toModel(): QuestionModel {
    return new QuestionModel(
      this.id,
      this.topicId,
      this.content,
      this.points,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
