import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
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
    reqAccountId: number,
  ): Promise<ExamQuestionModel[]> {
    const existingQuestions = await this.getExistingExamQuestions(
      exam.id,
      questionIds,
    );

    const existingQuestionIds = existingQuestions.map((eq) => eq.questionId);
    const newQuestionIds = questionIds.filter(
      (questionId) => !existingQuestionIds.includes(questionId),
    );

    if (newQuestionIds.length === 0) {
      return [];
    }

    const examQuestions = newQuestionIds.map((questionId) => {
      const entity = new ExamQuestionEntity();
      entity.examId = exam.id;
      entity.questionId = questionId;
      entity.createdAt = new Date();
      entity.createdBy = reqAccountId;
      return entity;
    });

    return await this.examQuestionRepository.save(examQuestions);
  }

  async deleteQuestionFromExam(
    examModel: ExamModel,
    questionModel: QuestionModel,
    reqAccountId: number,
  ): Promise<boolean> {
    await this.examQuestionRepository.update(
      {
        examId: examModel.id,
        questionId: questionModel.id,
      },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );

    return true;
  }

  async getQuestionsByExam(exam: ExamModel): Promise<ExamQuestionModel[]> {
    const examQuestions = await this.examQuestionRepository.find({
      where: { examId: exam.id, deletedAt: IsNull() },
    });

    if (!examQuestions || examQuestions.length === 0) {
      return [];
    }

    return examQuestions.map((eq) => eq.toModel());
  }

  async getExamsByQuestion(
    question: QuestionModel,
  ): Promise<ExamQuestionModel[]> {
    const examQuestions = await this.examQuestionRepository.find({
      where: { questionId: question.id, deletedAt: IsNull() },
    });

    if (!examQuestions || examQuestions.length === 0) {
      return [];
    }

    return examQuestions.map((eq) => eq.toModel());
  }
}
