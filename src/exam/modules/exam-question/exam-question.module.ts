import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamQuestionEntity } from './entities/exam-question.entity';
import { ExamQuestionController } from './exam-question.controller';
import { ExamQuestionService } from './exam-question.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExamQuestionEntity])],
  controllers: [ExamQuestionController],
  providers: [ExamQuestionService],
  exports: [ExamQuestionService],
})
export class ExamQuestionModule {}
