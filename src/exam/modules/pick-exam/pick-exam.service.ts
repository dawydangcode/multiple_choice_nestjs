import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PickExamEntity } from './entities/pick-exam.entity';
import { IsNull, Repository } from 'typeorm';
import { PickExamModel } from './models/pick-exam.model';
import { pick } from 'lodash';
import { UserService } from 'src/account/modules/user/user.service';
import { UserModel } from 'src/account/modules/user/model/user.model';
import { EXAM_DURATION } from 'src/utils/constant';
import ms from 'ms';

@Injectable()
export class PickExamService {
  constructor(
    @InjectRepository(PickExamEntity)
    private readonly pickExamRepository: Repository<PickExamEntity>,
    private readonly userService: UserService,
  ) {}

  async getPickExams(): Promise<PickExamEntity[]> {
    return this.pickExamRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async getPickExamById(pickExamId: number): Promise<PickExamModel> {
    const pickExam = await this.pickExamRepository.findOne({
      where: { id: pickExamId, deletedAt: IsNull() },
    });

    if (!pickExam) {
      throw new Error('Pick Exam not found');
    }

    return pickExam.toModel();
  }

  async createPickExam(
    userId: number,
    examId: number,
    startTime: Date,
    finishTime: Date,
    createdBy: number,
  ): Promise<PickExamModel> {
    const entity = new PickExamEntity();
    entity.userId = userId;
    entity.examId = examId;
    entity.startTime = startTime;
    entity.finishTime = finishTime;
    entity.createdBy = createdBy;
    entity.createdAt = new Date();

    const savedPickExam = await this.pickExamRepository.save(entity);
    return savedPickExam.toModel();
  }

  async updatePickExam(
    pickExam: PickExamModel,
    startTime: Date | undefined,
    finishTime: Date | undefined,
    reqAccountId: number,
  ): Promise<PickExamModel> {
    await this.pickExamRepository.update(
      { id: pickExam.id, deletedAt: IsNull() },
      {
        startTime: startTime,
        finishTime: finishTime,
        updatedBy: reqAccountId,
        updatedAt: new Date(),
      },
    );

    return await this.getPickExamById(pickExam.id);
  }

  async deletePickExam(
    pickExam: PickExamModel,
    deletedBy: number,
  ): Promise<boolean> {
    await this.pickExamRepository.update(
      { id: pickExam.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: deletedBy,
      },
    );
    return true;
  }

  async checkExistingPickExam(
    userId: number,
    examId: number,
  ): Promise<PickExamModel> {
    const existingPickExam = await this.pickExamRepository.findOne({
      where: {
        userId: userId,
        examId: examId,
        deletedAt: IsNull(),
      },
    });
    if (!existingPickExam) {
      throw new Error('No existing pick exam found for this user and exam');
    }

    return existingPickExam.toModel();
  }

  async startPickExam(
    user: UserModel,
    pickExam: PickExamModel,
    reqAccountId: number,
  ): Promise<PickExamModel> {
    await this.checkExistingPickExam(user.id, pickExam.examId);

    const startTime = new Date();
    const finishTime = new Date(startTime.getTime() + ms(EXAM_DURATION));

    return await this.createPickExam(
      user.id,
      pickExam.examId,
      startTime,
      finishTime,
      reqAccountId,
    );
  }

  async finishPickExam(
    pickExam: PickExamModel,
    user: UserModel,
  ): Promise<PickExamModel> {
    if (pickExam.userId !== user.id) {
      throw new Error('Unauthorized');
    }

    await this.pickExamRepository.update(
      { id: pickExam.id, deletedAt: IsNull() },
      {
        finishTime: new Date(),
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    );

    return await this.getPickExamById(pickExam.id);
  }
  
}
