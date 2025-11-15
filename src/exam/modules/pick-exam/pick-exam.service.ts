import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PickExamEntity } from './entities/pick-exam.entity';
import { In, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamModel } from 'src/exam/models/exam.model';
import { UserModel } from 'src/account/modules/user/model/user.model';
import { PickExamModel } from './models/pick-exam.model';
import { PickExamType } from './enum/pick-exam.type';
import { PickExamDetailService } from '../pick-exam-detail/pick-exam-detail.service';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { ExamService } from 'src/exam/exam.service';
import {
  StartPickExamResponseModel,
  ExamQuestionModel,
  ExamAnswerModel,
} from './models/start-pick-exam-response.model';
import { SubmittedAnswersModel } from './models/submitted-answers.model';
import { PickExamDetailEntity } from '../pick-exam-detail/entities/pick-exam-detail.entity';
import { ExamNotificationGateway } from 'src/exam/gateways/exam-notification.gateway';

@Injectable()
export class PickExamService {
  constructor(
    @InjectRepository(PickExamEntity)
    private readonly pickExamRepository: Repository<PickExamEntity>,
    private readonly pickExamDetailService: PickExamDetailService,
    private readonly examService: ExamService,
    private readonly examNotificationGateway: ExamNotificationGateway,
  ) {}

  async getPickExams(
    pickExamIds: number[] | undefined,
    userIds: number[] | undefined,
    examIds: number[] | undefined,
    status: PickExamType | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<PickExamModel>> {
    const [pickExams, total] = await this.pickExamRepository.findAndCount({
      where: {
        id: pickExamIds ? In(pickExamIds) : undefined,
        userId: userIds ? In(userIds) : undefined,
        examId: examIds ? In(examIds) : undefined,
        status: status ? status : undefined,
        deletedAt: IsNull(),
      },
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<PickExamModel>(
      total,
      pickExams.map((pickExam: PickExamEntity) => pickExam.toModel()),
    );
  }
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
    const activeExams = await this.examService.getExams(
      [exam.id],
      true,
      undefined,
      undefined,
      undefined,
    );

    if (activeExams.total === 0) {
      throw new BadRequestException('Exam not active');
    }

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

    // Gửi thông báo WebSocket khi bắt đầu làm bài
    this.examNotificationGateway.notifyExamStarted(user.id.toString(), {
      pickExamId: savedEntity.id,
      examId: exam.id,
      examTitle: exam.title,
      startTime: savedEntity.startTime,
      endTime: savedEntity.endTime,
      duration: exam.minuteDuration,
    });

    return savedEntity.toModel();
  }

  async startPickExamWithQuestions(
    exam: ExamModel,
    user: UserModel,
    reqAccountId: number,
  ): Promise<StartPickExamResponseModel> {
    const pickExam = await this.startPickExam(exam, user, reqAccountId);

    const examWithQuestions =
      await this.examService.getExamWithQuestionsAndAnswersById(exam);

    const questions: ExamQuestionModel[] = examWithQuestions.questions.map(
      (question) => {
        const answers: ExamAnswerModel[] = question.answers.map(
          (answer) => new ExamAnswerModel(answer.id, answer.content),
        );
        return new ExamQuestionModel(
          question.id,
          question.content,
          question.points,
          question.topicId,
          answers,
        );
      },
    );

    if (!pickExam.startTime || !pickExam.endTime) {
      throw new BadRequestException('Invalid exam timing data');
    }

    return new StartPickExamResponseModel(
      pickExam,
      questions,
      examWithQuestions.totalQuestions,
      pickExam.startTime,
      pickExam.endTime,
      exam.minuteDuration,
    );
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

  private async validateSubmittedAnswers(
    pickExam: PickExamModel,
    submittedAnswers: SubmittedAnswersModel,
  ): Promise<true> {
    const submittedQuestionIds = submittedAnswers.answers.map(
      (answer) => answer.questionId,
    );
    const uniqueQuestionIds = new Set(submittedQuestionIds);

    if (submittedQuestionIds.length !== uniqueQuestionIds.size) {
      throw new BadRequestException('Duplicate question answers detected.');
    }

    const exam = await this.examService.getExamById(pickExam.examId);
    const examWithQuestions =
      await this.examService.getExamWithQuestionsAndAnswersById(exam);

    if (submittedAnswers.answers.length > examWithQuestions.questions.length) {
      throw new BadRequestException(
        `Too many answers submitted. Expected maximum ${examWithQuestions.questions.length} answers, got ${submittedAnswers.answers.length}.`,
      );
    }

    const validQuestionIds = new Set(
      examWithQuestions.questions.map((question) => question.id),
    );
    const validAnswersByQuestion = new Map<number, Set<number>>();

    examWithQuestions.questions.forEach((question) => {
      const answerIds = new Set(question.answers.map((answer) => answer.id));
      validAnswersByQuestion.set(question.id, answerIds);
    });

    for (const answer of submittedAnswers.answers) {
      if (!validQuestionIds.has(answer.questionId)) {
        throw new BadRequestException(
          `Invalid question ID ${answer.questionId}. This question does not belong to the exam.`,
        );
      }

      const validAnswers = validAnswersByQuestion.get(answer.questionId);
      if (!validAnswers || !validAnswers.has(answer.answerId)) {
        throw new BadRequestException(
          `Invalid answer ID ${answer.answerId} for question ${answer.questionId}. This answer does not belong to the question.`,
        );
      }
    }

    return true;
  }

  async submitPickExamWithAnswers(
    pickExam: PickExamModel,
    submittedAnswers: SubmittedAnswersModel,
    reqAccountId: number,
  ): Promise<PickExamModel> {
    const currentPickExam = await this.getPickExamById(pickExam.id);

    await this.getPickExams(
      [pickExam.id],
      [currentPickExam.userId],
      [currentPickExam.examId],
      PickExamType.IN_PROGRESS,
      undefined,
      undefined,
      undefined,
    );

    if (currentPickExam.finishTime) {
      throw new ConflictException('Exam has already been submitted.');
    }

    await this.validateSubmittedAnswers(currentPickExam, submittedAnswers);

    console.log('All validations passed:', currentPickExam.id);

    const pickExamDetails: PickExamDetailEntity[] =
      submittedAnswers.answers.map((answer) => {
        const detail = new PickExamDetailEntity();
        detail.questionId = answer.questionId;
        detail.answerId = answer.answerId;
        detail.createdBy = reqAccountId;
        detail.createdAt = new Date();

        return detail;
      });

    await this.pickExamDetailService.savePickExamDetails(
      currentPickExam.id,
      pickExamDetails,
      reqAccountId,
    );

    const score = await this.pickExamDetailService.calculateScore(
      currentPickExam.id,
    );

    await this.pickExamRepository.update(
      {
        id: currentPickExam.id,
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

    const finalResult = await this.getPickExamById(currentPickExam.id);

    // Gửi thông báo WebSocket khi hoàn thành bài thi
    this.examNotificationGateway.notifyExamResult(
      currentPickExam.userId.toString(),
      {
        pickExamId: finalResult.id,
        examId: finalResult.examId,
        status: finalResult.status,
        score: finalResult.score,
        percentage: finalResult.percentage,
        totalQuestions: finalResult.totalQuestions,
        correctAnswers: finalResult.correctAnswers,
        finishTime: finalResult.finishTime,
      },
    );

    return finalResult;
  }
}
