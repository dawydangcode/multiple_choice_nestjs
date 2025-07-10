import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamQuestionEntity } from './entities/exam-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamQuestionEntity])],
  controllers: [],
  providers: [],
})
export class ExamQuestionModule {}
