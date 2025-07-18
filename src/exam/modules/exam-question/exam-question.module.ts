import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamQuestionEntity } from './entities/exam-question.entity';
import { ExamQuestionController } from './exam-question.controller';
import { ExamQuestionService } from './exam-question.service';
import { ExamModule } from 'src/exam/exam.module';
import { QuestionModule } from 'src/question/question.module';
import { QuestionEntity } from 'src/question/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamQuestionEntity, QuestionEntity]),
    forwardRef(() => ExamModule),
    forwardRef(() => QuestionModule),
  ],
  controllers: [ExamQuestionController],
  providers: [ExamQuestionService],
  exports: [ExamQuestionService],
})
export class ExamQuestionModule {}
