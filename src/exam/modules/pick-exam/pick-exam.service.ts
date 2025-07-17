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

    const entity = new PickExamEntity();
    entity.examId = exam.id;
    entity.userId = user.id;
    entity.startTime = startTime;
    entity.createdAt = startTime;
    entity.createdBy = reqAccountId;

    const savedEntity = await this.pickExamRepository.save(entity);
    return savedEntity.toModel();
  }
}
