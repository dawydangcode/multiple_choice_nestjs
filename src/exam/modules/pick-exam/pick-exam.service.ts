import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PickExamEntity } from './entities/pick-exam.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamModel } from 'src/exam/models/exam.model';
import { UserModel } from 'src/account/modules/user/model/user.model';
import { get } from 'lodash';
import { PickExamModel } from './models/pick-exam.model';
import e from 'express';
import { PickExamType } from './enum/pick-exam.type';

@Injectable()
export class PickExamService {
  constructor(
    @InjectRepository(PickExamEntity)
    private readonly pickExamRepository: Repository<PickExamEntity>,
  ) {}

  async getPickExamById(pickExamId: number): Promise<PickExamModel> {
    const pickExam = await this.pickExamRepository.findOne({
      where: {
        id: pickExamId,
        deletedAt: IsNull(),
      },
    });
    if (!pickExam) {
      throw new Error('Pick Exam not found');
    }
    return pickExam.toModel();
  }

  async getPickExamByUserId(
    user: UserModel,
    exam: ExamModel,
  ): Promise<PickExamModel[]> {
    const pickExams = await this.pickExamRepository.find({
      where: {
        examId: exam.id,
        userId: user.id,
        deletedAt: IsNull(),
      },
    });
    return pickExams.map((pickExam: PickExamEntity) => pickExam.toModel());
  }

  async startPickExam(
    exam: ExamModel,
    user: UserModel,
    status: PickExamType,
    reqAccountId: number,
  ): Promise<PickExamModel> {
    if (!exam.isActive) {
      throw new BadRequestException('Exam is not active');
    }

    const existingPickExam = await this.getPickExamByUserId(user, exam);

    if (existingPickExam) {
      throw new ConflictException('User has already started this exam');
    }

    const startTime = new Date();

    const minuteDuration = exam.minuteDuration ?? 0;
    const endTime = new Date(startTime.getTime() + minuteDuration * 60 * 1000);

    const entity = new PickExamEntity();
    entity.examId = exam.id;
    entity.userId = user.id;
    entity.startTime = startTime;
    entity.endTime = endTime;
    entity.status = PickExamType.IN_PROGRESS;
    entity.createdAt = startTime;
    entity.createdBy = reqAccountId;

    const savedEntity = await this.pickExamRepository.save(entity);
    return savedEntity.toModel();
  }

  async submitPickExam(
    pickExam: PickExamModel,
    reqAccountId: number,
  ): Promise<PickExamModel> {
    await this.getPickExamById(pickExam.id);

    await this.pickExamRepository.update(
      {
        id: pickExam.id,
        deletedAt: IsNull(),
      },
      {
        finishTime: new Date(),
        status: PickExamType.COMPLETED,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );

    return this.getPickExamById(pickExam.id);
  }

  async autoSubmitExpiredExams(): Promise<void> {
    const now = new Date();

    const expiredExams = await this.pickExamRepository.find({
      where: {
        status: PickExamType.IN_PROGRESS,
        deletedAt: IsNull(),
      },
    });

    const toUpdate = expiredExams.filter((exam) => now > exam.endTime);

    for (const exam of toUpdate) {
      exam.finishTime = exam.endTime;
      exam.status = PickExamType.COMPLETED;
      exam.updatedAt = now;
      await this.pickExamRepository.save(exam);
    }
  }
}
