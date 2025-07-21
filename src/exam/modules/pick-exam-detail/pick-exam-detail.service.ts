import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { PickExamDetailEntity } from './entities/pick-exam-detail.entity';
import { PickExamDetailModel } from './models/pick-exam-detail.model';
import { PickExamDetailDto } from './dtos/pick-exam-detail.dto';
import { ScoreModel } from './models/score.model';
import { PickExamModel } from '../pick-exam/models/pick-exam.model';

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

  async calculateScore(pickExam: PickExamModel): Promise<ScoreModel> {
    const details = await this.pickExamDetailRepository.find({
      where: {
        id: pickExam.id,
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

    return new ScoreModel(totalQuestions, correctAnswers, score, percentage);
  }

  async getUserAnswers(pickExamId: number): Promise<PickExamDetailModel[]> {
    const details = await this.pickExamDetailRepository.find({
      where: {
        pickExamId,
        deletedAt: IsNull(),
      },
      relations: ['question', 'answer'],
    });

    return details.map((detail) => detail.toModel());
  }

  async getDetailedResults(pickExam: PickExamModel): Promise<{
    score: ScoreModel;
    details: Array<{
      questionId: number;
      questionText: string;
      userAnswerId: number;
      userAnswerText: string;
      correctAnswerId: number;
      correctAnswerText: string;
      isCorrect: boolean;
    }>;
  }> {
    const details = await this.pickExamDetailRepository.find({
      where: {
        id: pickExam.id,
        deletedAt: IsNull(),
      },
      relations: ['question', 'answer', 'question.answers'],
    });

    const score = await this.calculateScore(pickExam);

    const detailResults = details.map((detail) => {
      const correctAnswer = detail.question?.answers?.find(
        (answer) => answer.isCorrect === true,
      );

      return {
        questionId: detail.questionId,
        questionText: detail.question?.content || '',
        userAnswerId: detail.answerId,
        userAnswerText: detail.answer?.content || '',
        correctAnswerId: correctAnswer?.id || 0,
        correctAnswerText: correctAnswer?.content || '',
        isCorrect: detail.answer?.isCorrect === true,
      };
    });

    return {
      score,
      details: detailResults,
    };
  }
}
