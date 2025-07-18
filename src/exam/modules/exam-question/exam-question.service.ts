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
import { QuestionService } from 'src/question/question.service';
import { ExamService } from 'src/exam/exam.service';

@Injectable()
export class ExamQuestionService {
  constructor(
    @InjectRepository(ExamQuestionEntity)
    private readonly examQuestionRepository: Repository<ExamQuestionEntity>,
    private readonly questionService: QuestionService,
    private readonly examService: ExamService,
  ) {}

  private async validateAndCheckExistingQuestions(
    examId: number,
    questionIds: number[],
  ): Promise<{
    existingInExam: ExamQuestionEntity[];
    notFoundQuestions: number[];
  }> {
    const existingQuestions =
      await this.questionService.getQuestionsByIds(questionIds);
    const existingQuestionIds = existingQuestions.map((q) => q.id);
    const notFoundQuestionIds = questionIds.filter(
      (id) => !existingQuestionIds.includes(id),
    );

    if (notFoundQuestionIds.length > 0) {
      throw new NotFoundException(
        `NOT FOUND QUESTION ID: ${notFoundQuestionIds.join(', ')}`,
      );
    }

    const existingInExam = await this.examQuestionRepository.find({
      where: {
        examId: examId,
        questionId: In(questionIds),
        deletedAt: IsNull(),
      },
    });

    return {
      existingInExam,
      notFoundQuestions: notFoundQuestionIds,
    };
  }

  async addQuestionsToExam(
    exam: ExamModel,
    questionIds: number[],
    reqAccountId: number,
  ): Promise<ExamQuestionModel[]> {
    await this.examService.checkExamQuestionsIsMoreThanLimit(exam);

    const { existingInExam } = await this.validateAndCheckExistingQuestions(
      exam.id,
      questionIds,
    );

    if (existingInExam.length > 0) {
      const existingQuestionIds = existingInExam.map(
        (existingQuestion) => existingQuestion.questionId,
      );
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
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );

    return true;
  }

  async getExamQuestionsByExamId(examId: number): Promise<ExamQuestionModel[]> {
    const examQuestions = await this.examQuestionRepository.find({
      where: {
        examId: examId,
        deletedAt: IsNull(),
      },
    });

    return examQuestions.map((examQuestion) => examQuestion.toModel());
  }
}
