import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ExamQuestionEntity } from './entities/exam-question.entity';
import { ExamModel } from 'src/exam/models/exam.model';
import { QuestionModel } from 'src/question/models/question.model';
import { ExamQuestionModel } from './models/exam-question.module';

@Injectable()
export class ExamQuestionService {
  constructor(
    @InjectRepository(ExamQuestionEntity)
    private readonly examQuestionRepository: Repository<ExamQuestionEntity>,
  ) {}

  async addQuestionsToExam(
    examModel: ExamModel,
    questionModel: QuestionModel,
  ): Promise<ExamQuestionModel> {
    const examQuestion = new ExamQuestionEntity();
    examQuestion.examId = examModel.id;
    examQuestion.questionId = questionModel.id;

    return this.examQuestionRepository.save(examQuestion);
  }

  async removeQuestionFromExam(
    examModel: ExamModel,
    questionModel: QuestionModel,
  ): Promise<boolean> {
    await this.examQuestionRepository.delete({
      examId: examModel.id,
      questionId: questionModel.id,
    });

    return true;
  }
}
