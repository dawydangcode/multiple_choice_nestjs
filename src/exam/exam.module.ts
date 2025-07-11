import { forwardRef, Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamEntity } from './entities/exam.entity';
import { ExamQuestionModule } from './modules/exam-question/exam-question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamEntity]),
    forwardRef(() => ExamQuestionModule),
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
