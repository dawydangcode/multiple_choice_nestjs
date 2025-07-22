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
    await this.pickExamDetailRepository.update(
      { pickExamId, deletedAt: IsNull() },
      { deletedAt: new Date(), deletedBy: reqAccountId },
    );

    const entities = answers.map((answer) => {
      const entity = new PickExamDetailEntity();
      entity.pickExamId = pickExamId;
      entity.questionId = answer.questionId;
      entity.answerId = answer.answerId;
      entity.createdAt = new Date();
      entity.createdBy = reqAccountId;
      return entity;
    });

    const savedEntities = await this.pickExamDetailRepository.save(entities);

    return savedEntities.map((entity) => entity.toModel());
  }

  async getPickExamDetailsByPickExamId(
    pickExam: PickExamModel,
  ): Promise<PickExamDetailModel[]> {
    const details = await this.pickExamDetailRepository.find({
      where: {
        pickExamId: pickExam.id,
        deletedAt: IsNull(),
      },
    });

    return details.map((detail) => detail.toModel());
  }

  async calculateScore(pickExamId: number): Promise<ScoreModel> {
    const details = await this.pickExamDetailRepository.find({
      where: {
        pickExamId: pickExamId,
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
}
