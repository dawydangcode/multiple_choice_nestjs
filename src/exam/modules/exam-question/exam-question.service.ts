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

  private async getExistingExamQuestions(
    examId: number,
    questionIds: number[],
  ): Promise<ExamQuestionEntity[]> {
    return this.examQuestionRepository.find({
      where: {
        examId: examId,
        questionId: In(questionIds),
      },
    });
  }

  async addQuestionsToExam(
    exam: ExamModel,
    questionIds: number[],
  ): Promise<ExamQuestionModel[]> {
    const existingQuestions = await this.getExistingExamQuestions(
      exam.id,
      questionIds,
    );

    // Lọc ra những câu hỏi chưa tồn tại trong exam
    const existingQuestionIds = existingQuestions.map((eq) => eq.questionId);
    const newQuestionIds = questionIds.filter(
      (questionId) => !existingQuestionIds.includes(questionId),
    );

    if (newQuestionIds.length === 0) {
      return [];
    }

    // Tạo array các ExamQuestionEntity
    const examQuestions = newQuestionIds.map((questionId) => {
      const examQuestion = new ExamQuestionEntity();
      examQuestion.examId = exam.id;
      examQuestion.questionId = questionId;
      return examQuestion;
    });

    return await this.examQuestionRepository.save(examQuestions);
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
