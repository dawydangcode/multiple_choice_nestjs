import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
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
import { PickExamDetailService } from '../pick-exam-detail/pick-exam-detail.service';
import { SubmitAnswersDto, SaveAnswersDto } from './dtos/submit-answers.dto';
import { PickExamDetailDto } from '../pick-exam-detail/dtos/pick-exam-deltail.dto';
import { start } from 'repl';

@Injectable()
export class PickExamService {
  constructor(
    @InjectRepository(PickExamEntity)
    private readonly pickExamRepository: Repository<PickExamEntity>,
    private readonly pickExamDetailService: PickExamDetailService,
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

    if (existingPickExam.length > 0) {
      throw new ConflictException('User has already started this exam');
    }
    const minuteDuration = exam.minuteDuration ?? 0;

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + minuteDuration * 60000);

    const entity = new PickExamEntity();
    entity.examId = exam.id;
    entity.userId = user.id;
    entity.startTime = startTime;
    entity.endTime = endTime;
    entity.status = PickExamType.IN_PROGRESS;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;

    console.log('Debug - Before save entity:', {
      startTime: entity.startTime,
      endTime: entity.endTime,
      status: entity.status,
    });

    const savedEntity = await this.pickExamRepository.save(entity);

    console.log('Debug - After save entity:', {
      id: savedEntity.id,
      startTime: savedEntity.startTime,
      endTime: savedEntity.endTime,
      status: savedEntity.status,
    });

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

  // ✅ Submit bài thi với câu trả lời
  async submitPickExamWithAnswers(
    pickExamId: number,
    submitData: SubmitAnswersDto,
    reqAccountId: number,
  ): Promise<{
    pickExam: PickExamModel;
    score: {
      totalQuestions: number;
      correctAnswers: number;
      score: number;
      percentage: number;
    };
  }> {
    const pickExam = await this.pickExamRepository.findOne({
      where: { id: pickExamId, deletedAt: IsNull() },
    });

    if (!pickExam) {
      throw new NotFoundException('Pick exam not found');
    }

    if (pickExam.status !== PickExamType.IN_PROGRESS) {
      throw new BadRequestException('Exam is not in progress');
    }

    // Save pick exam details
    const pickExamDetails = submitData.answers.map((answer) => {
      const dto = new PickExamDetailDto();
      dto.questionId = answer.questionId;
      dto.answerId = answer.answerId;
      dto.reqAccountId = reqAccountId;
      return dto;
    });

    await this.pickExamDetailService.savePickExamDetails(
      pickExamId,
      pickExamDetails,
      reqAccountId,
    );

    // Update pick exam status
    const now = new Date();
    pickExam.finishTime = now;
    pickExam.status = PickExamType.COMPLETED;
    pickExam.updatedAt = now;
    pickExam.updatedBy = reqAccountId;

    const savedPickExam = await this.pickExamRepository.save(pickExam);

    // Calculate score
    const score = await this.pickExamDetailService.calculateScore(pickExamId);

    return {
      pickExam: savedPickExam.toModel(),
      score,
    };
  }

  // ✅ Lưu câu trả lời tạm thời (không submit)
  async saveAnswersTemporary(
    pickExamId: number,
    saveData: SaveAnswersDto,
    reqAccountId: number,
  ): Promise<void> {
    const pickExam = await this.pickExamRepository.findOne({
      where: { id: pickExamId, deletedAt: IsNull() },
    });

    if (!pickExam) {
      throw new NotFoundException('Pick exam not found');
    }

    if (pickExam.status !== PickExamType.IN_PROGRESS) {
      throw new BadRequestException('Exam is not in progress');
    }

    // Check if exam is expired
    const now = new Date();
    if (now > pickExam.endTime) {
      throw new BadRequestException('Exam has expired');
    }

    // Save details temporarily
    const pickExamDetails = saveData.answers.map((answer) => {
      const dto = new PickExamDetailDto();
      dto.questionId = answer.questionId;
      dto.answerId = answer.answerId;
      dto.reqAccountId = reqAccountId;
      return dto;
    });

    await this.pickExamDetailService.savePickExamDetails(
      pickExamId,
      pickExamDetails,
      reqAccountId,
    );
  }

  // ✅ Get user answers
  async getUserAnswers(pickExamId: number) {
    return this.pickExamDetailService.getPickExamDetailsByPickExamId(
      pickExamId,
    );
  }

  // ✅ Get detailed results
  async getDetailedResults(pickExamId: number) {
    return this.pickExamDetailService.getDetailedResults(pickExamId);
  }
}
