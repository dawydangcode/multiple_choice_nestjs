import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { ExamQuestionEntity } from './entities/exam-question.entity';
import { ExamModel } from 'src/exam/models/exam.model';
import { QuestionModel } from 'src/question/models/question.model';
import { ExamQuestionModel } from './models/exam-question.model';
import { QuestionEntity } from 'src/question/entities/question.entity';

@Injectable()
export class ExamQuestionService {
  constructor(
    @InjectRepository(ExamQuestionEntity)
    private readonly examQuestionRepository: Repository<ExamQuestionEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  private async getQuestionsAlreadyInExam(
    examId: number,
    questionIds: number[],
  ): Promise<ExamQuestionEntity[]> {
    return this.examQuestionRepository.find({
      where: {
        examId: examId,
        questionId: In(questionIds),
        deletedAt: IsNull(),
      },
    });
  }

  private async validateQuestionsExist(questionIds: number[]): Promise<void> {
    const existingQuestions = await this.questionRepository.find({
      where: {
        id: In(questionIds),
        deletedAt: IsNull(),
      },
      select: ['id'],
    });

    const existingQuestionIds = existingQuestions.map((q) => q.id);
    const notFoundQuestionIds = questionIds.filter(
      (id) => !existingQuestionIds.includes(id),
    );

    if (notFoundQuestionIds.length > 0) {
      throw new NotFoundException(
        `NOT FOUND QUESTION ID: ${notFoundQuestionIds.join(', ')}`,
      );
    }
  }

  async addQuestionsToExam(
    exam: ExamModel,
    questionIds: number[],
    reqAccountId: number,
  ): Promise<ExamQuestionModel[]> {
    await this.validateQuestionsExist(questionIds);

    const existingQuestions = await this.getQuestionsAlreadyInExam(
      exam.id,
      questionIds,
    );

    if (existingQuestions.length > 0) {
      const existingQuestionIds = existingQuestions.map((eq) => eq.questionId);
      throw new ConflictException(
        `CONFLICT: ${existingQuestionIds.join(', ')}`,
      );
    }

    const examQuestions = questionIds.map((questionId) => {
      const entity = new ExamQuestionEntity();
      entity.examId = exam.id;
      entity.questionId = questionId;
      entity.createdAt = new Date();
      entity.createdBy = reqAccountId;
      return entity;
    });

    const savedExamQuestions =
      await this.examQuestionRepository.save(examQuestions);
    return savedExamQuestions.map((eq) => eq.toModel());
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

    return examQuestions.map((eq: ExamQuestionEntity) => eq.toModel());
  }
}
