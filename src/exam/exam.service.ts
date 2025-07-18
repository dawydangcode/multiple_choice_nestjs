import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamEntity } from './entities/exam.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamModel } from './models/exam.model';
import ms from 'ms';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationResponse } from 'src/common/models/pagination-response.model';
import { PaginationUtil } from 'src/common/utils/pagination.util';
import { ExamQuestionAnswerModel } from './models/exam-question-answer.model';
import { EXAM_QUESTION_LIMIT } from 'src/common/utils/constant';
import { ISO_8601 } from 'moment';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>,
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
      relations: [
        'examQuestions',
        'examQuestions.question',
        'examQuestions.question.answers',
      ],
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam.toModel();
  }

  async getExamEntityById(examId: number): Promise<ExamEntity> {
    const exam = await this.examRepository.findOne({
      where: {
        id: examId,
        deletedAt: IsNull(),
      },
      relations: [
        'examQuestions',
        'examQuestions.question',
        'examQuestions.question.answers',
      ],
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
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

    return await this.getExamById(exam.id);
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
    const examEntity = await this.getExamEntityById(exam.id);

    const questions =
      examEntity.examQuestions
        ?.filter(
          (examQuestion) =>
            examQuestion.deletedAt === null &&
            examQuestion.question?.deletedAt === null,
        )
        .map((examQuestion) => {
          const question = examQuestion.question;
          if (!question) {
            return null;
          }
          return {
            id: question.id,
            content: question.content,
            points: question.points,
            topicId: question.topicId,
            answers:
              question.answers
                ?.filter((answer) => answer.deletedAt === null)
                .map((answer) => ({
                  id: answer.id,
                  content: answer.content,
                  isCorrect: answer.isCorrect,
                })) || [],
          };
        })
        .filter((question) => question !== null) || [];

    const totalQuestions = questions.length;
    const totalPoints = questions.reduce(
      (sum, question) => sum + question.points,
      0,
    );
    const averagePoints =
      totalQuestions > 0
        ? Math.round((totalPoints / totalQuestions) * 100) / 100
        : 0;

    return new ExamQuestionAnswerModel(
      exam,
      questions,
      totalQuestions,
      totalPoints,
      averagePoints,
    );
  }

  async checkExamQuestionsIsMoreThanLimit(exam: ExamModel): Promise<boolean> {
    const examEntity = await this.getExamEntityById(exam.id);
    const questionCount = examEntity.examQuestions?.length || 0;

    if (questionCount > EXAM_QUESTION_LIMIT) {
      throw new Error('Exam cannot have more than 20 questions');
    }

    return questionCount > 0;
  }
}
