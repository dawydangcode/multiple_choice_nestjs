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
import { PickExamModel } from './models/pick-exam.model';
import { PickExamType } from './enum/pick-exam.type';
import { PickExamDetailService } from '../pick-exam-detail/pick-exam-detail.service';
import { PickExamDetailDto } from '../pick-exam-detail/dtos/pick-exam-detail.dto';
import { SubmitAnswersBodyDto } from './dtos/submit-answers.dto';

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
    } // To DO

    const existingPickExam = await this.getPickExamByUserId(user, exam);

    if (existingPickExam.length > 0) {
      throw new ConflictException('User has already started this exam');
    }
    const minuteDuration = exam.minuteDuration;
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

    const savedEntity = await this.pickExamRepository.save(entity);

    console.log('Debug - After save entity:', {
      id: savedEntity.id,
      startTime: savedEntity.startTime,
      endTime: savedEntity.endTime,
      status: savedEntity.status,
    });

    return savedEntity.toModel();
  }

  // async autoSubmitExpiredExams(): Promise<void> {
  //   const now = new Date();

  //   const expiredExams = await this.pickExamRepository.find({
  //     where: {
  //       status: PickExamType.IN_PROGRESS,
  //       deletedAt: IsNull(),
  //     },
  //   });

  //   const toUpdate = expiredExams.filter((exam) => now > exam.endTime);

  //   for (const exam of toUpdate) {
  //     exam.finishTime = exam.endTime;
  //     exam.status = PickExamType.COMPLETED;
  //     exam.updatedAt = now;
  //     await this.pickExamRepository.save(exam);
  //   }
  // }

  async submitPickExamWithAnswers(
    pickExam: PickExamModel,
    submitAnswer: SubmitAnswersBodyDto,
    reqAccountId: number,
  ): Promise<PickExamModel> {
    await this.getPickExamById(pickExam.id);

    if (pickExam.status !== PickExamType.IN_PROGRESS) {
      throw new BadRequestException('Exam is not in progress');
    }

    const pickExamDetails = submitAnswer.answers.map((answer) => {
      const pickExamDto = new PickExamDetailDto();
      pickExamDto.questionId = answer.questionId;
      pickExamDto.answerId = answer.answerId;
      pickExamDto.reqAccountId = reqAccountId;
      return pickExamDto;
    }); // To DO

    await this.pickExamDetailService.savePickExamDetails(
      pickExam.id,
      pickExamDetails,
      reqAccountId,
    );

    const score = await this.pickExamDetailService.calculateScore(pickExam.id);

    await this.pickExamRepository.update(
      {
        id: pickExam.id,
        deletedAt: IsNull(),
      },
      {
        status: PickExamType.COMPLETED,
        finishTime: new Date(),
        totalQuestions: score.totalQuestions,
        correctAnswers: score.correctAnswers,
        score: score.score,
        percentage: score.percentage,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );

    return await this.getPickExamById(pickExam.id);
  }
}
