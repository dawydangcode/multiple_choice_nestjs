import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { PickExamDetailEntity } from './entities/pick-exam-detail.entity';
import { PickExamDetailModel } from './models/pick-exam-detail.model';
import { PickExamDetailDto } from './dtos/pick-exam-deltail.dto';

@Injectable()
export class PickExamDetailService {
  constructor(
    @InjectRepository(PickExamDetailEntity)
    private readonly pickExamDetailRepository: Repository<PickExamDetailEntity>,
  ) {}

  async savePickExamDetails(
    pickExamId: number,
    answers: PickExamDetailDto[],
    reqAccountId: number,
  ): Promise<PickExamDetailModel[]> {
    const now = new Date();

    await this.pickExamDetailRepository.update(
      { pickExamId, deletedAt: IsNull() },
      { deletedAt: now, deletedBy: reqAccountId },
    );

    const entities = answers.map((answer) => {
      const entity = new PickExamDetailEntity();
      entity.pickExamId = pickExamId;
      entity.questionId = answer.questionId;
      entity.answerId = answer.answerId;
      entity.createdAt = now;
      entity.createdBy = reqAccountId;
      return entity;
    });

    const savedEntities = await this.pickExamDetailRepository.save(entities);
    return savedEntities.map((entity) => entity.toModel());
  }

  async getPickExamDetailsByPickExamId(
    pickExamId: number,
  ): Promise<PickExamDetailModel[]> {
    const details = await this.pickExamDetailRepository.find({
      where: {
        pickExamId,
        deletedAt: IsNull(),
      },
      relations: ['question', 'answer'],
    });

    return details.map((detail) => detail.toModel());
  }

  async calculateScore(pickExamId: number): Promise<{
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    percentage: number;
  }> {
    const details = await this.pickExamDetailRepository.find({
      where: {
        pickExamId,
        deletedAt: IsNull(),
      },
      relations: ['answer'],
    });

    const totalQuestions = details.length;
    const correctAnswers = details.filter(
      (detail) => detail.answer?.isCorrect === true,
    ).length;

    const score = correctAnswers;
    const percentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    return {
      totalQuestions,
      correctAnswers,
      score,
      percentage,
    };
  }

  async getDetailedResults(pickExamId: number): Promise<{
    pickExamId: number;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    percentage: number;
    details: {
      questionId: number;
      questionContent: string;
      userAnswerId: number;
      userAnswerContent: string;
      correctAnswerId: number;
      correctAnswerContent: string;
      isCorrect: boolean;
    }[];
  }> {
    const details = await this.pickExamDetailRepository.find({
      where: {
        pickExamId,
        deletedAt: IsNull(),
      },
      relations: ['question', 'answer', 'question.answers'],
    });

    const totalQuestions = details.length;
    const correctAnswers = details.filter(
      (detail) => detail.answer?.isCorrect === true,
    ).length;

    const score = correctAnswers;
    const percentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    const detailedResults = details.map((detail) => {
      const correctAnswer = detail.question?.answers?.find(
        (answer) => answer.isCorrect,
      );

      return {
        questionId: detail.questionId,
        questionContent: detail.question?.content || '',
        userAnswerId: detail.answerId,
        userAnswerContent: detail.answer?.content || '',
        correctAnswerId: correctAnswer?.id || 0,
        correctAnswerContent: correctAnswer?.content || '',
        isCorrect: detail.answer?.isCorrect || false,
      };
    });

    return {
      pickExamId,
      totalQuestions,
      correctAnswers,
      score,
      percentage,
      details: detailedResults,
    };
  }
}
