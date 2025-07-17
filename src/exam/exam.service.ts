import { Injectable } from '@nestjs/common';
import { ExamEntity } from './entities/exam.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamModel } from './models/exam.model';
import ms from 'ms';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationResponse } from 'src/common/models/pagination-response.model';
import { PaginationUtil } from 'src/common/utils/pagination.util';
import { ExamQuestionService } from './modules/exam-question/exam-question.service';
import { QuestionService } from 'src/question/question.service';
import { AnswerService } from 'src/question/modules/answer/answer.service';
import { ExamQuestionAnswerModel } from './models/exam-question-answer.model';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>,
    private readonly examQuestionService: ExamQuestionService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  async getExams(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<ExamModel>> {
    const { search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.examRepository
      .createQueryBuilder('exam')
      .where('exam.deletedAt IS NULL');

    if (search) {
      queryBuilder.andWhere('exam.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy(`exam.${sortBy}`, sortOrder);

    const result = await PaginationUtil.paginate(queryBuilder, paginationDto);

    const exams = result.data.map((exam: ExamEntity) => exam.toModel());

    return new PaginationResponse(exams, result.meta);
  }

  async getExamById(examId: number): Promise<ExamModel> {
    const exam = await this.examRepository.findOne({
      where: {
        id: examId,
        deletedAt: IsNull(),
      },
    });

    if (!exam) {
      throw new Error('Exam not found');
    }

    return exam.toModel();
  }

  async createExam(
    title: string,
    minuteDuration: number,
    description: string,
    isActive: boolean,
    reqAccountId: number,
  ) {
    const entity = new ExamEntity();

    entity.title = title;
    entity.minuteDuration = minuteDuration;
    entity.description = description;
    entity.isActive = isActive;
    entity.createdBy = reqAccountId;
    entity.createdAt = new Date();

    const savedExam = await this.examRepository.save(entity);
    return savedExam.toModel();
  }

  async updateExam(
    exam: ExamModel,
    title: string | undefined,
    minuteDuration: number | undefined,
    description: string | undefined,
    isActive: boolean | undefined,
    reqAccountId: number | undefined,
  ): Promise<ExamModel> {
    await this.examRepository.update(
      {
        id: exam.id,
        deletedAt: IsNull(),
      },
      {
        title: title,
        minuteDuration: minuteDuration,
        description: description,
        isActive: isActive,
        updatedBy: reqAccountId,
        updatedAt: new Date(),
      },
    );
    return this.getExamById(exam.id);
  }

  async deleteExam(exam: ExamModel, reqAccountId: number): Promise<boolean> {
    await this.examRepository.update(
      {
        id: exam.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );

    return true;
  }

  async getExamWithQuestionsAndAnswersById(
    exam: ExamModel,
  ): Promise<ExamQuestionAnswerModel> {
    const examQuestions =
      await this.examQuestionService.getExamQuestionsByExamId(exam.id);

    const questions = await Promise.all(
      examQuestions
        ?.filter(
          (examQuestion) =>
            examQuestion.deletedAt === null && examQuestion.questionId !== null,
        )
        .map(async (examQuestion) => {
          // Fetch question details using questionId
          const question = await this.questionService.getQuestionById(
            examQuestion.questionId,
          );

          // Fetch answers for this question
          const answers = await this.answerService.getAnswersByQuestionId(
            examQuestion.questionId,
          );

          return {
            id: question.id,
            content: question.content,
            points: question.points,
            topicId: question.topicId,
            answers: answers.map((answer) => ({
              id: answer.id,
              content: answer.content,
              isCorrect: answer.isCorrect,
            })),
          };
        }) || [],
    );

    const totalQuestions = questions.length;

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const averagePoints =
      totalQuestions > 0
        ? Math.round((totalPoints / totalQuestions) * 100) / 100
        : 0;

    return new ExamQuestionAnswerModel(
      exam,
      questions,
      totalQuestions,
      totalPoints,
      averagePoints
    );
  }
}
