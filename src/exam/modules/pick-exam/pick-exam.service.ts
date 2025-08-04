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
import { PickExamDetailDto } from '../pick-exam-detail/dtos/pick-exam-detail.dto';
import { SubmitAnswersBodyDto } from './dtos/submit-answers.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { PickType } from '@nestjs/swagger';
import { ExamService } from 'src/exam/exam.service';
import {
  StartPickExamResponseModel,
  ExamQuestionModel,
  ExamAnswerModel,
} from './models/start-pick-exam-response.model';
import {
  SubmittedAnswersModel,
  SubmittedAnswerModel,
} from './models/submitted-answers.model';

@Injectable()
export class PickExamService {
  constructor(
    @InjectRepository(PickExamEntity)
    private readonly pickExamRepository: Repository<PickExamEntity>,
    private readonly pickExamDetailService: PickExamDetailService,
    private readonly examService: ExamService,
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

  /**
   * Convert DTO to domain model để tách biệt presentation layer và business logic layer
   * Đây là adapter pattern để không để DTO "leak" vào service logic
   */
  private convertDtoToSubmittedAnswers(
    submitAnswer: SubmitAnswersBodyDto,
  ): SubmittedAnswersModel {
    const answerModels = submitAnswer.answers.map(
      (answer) => new SubmittedAnswerModel(answer.questionId, answer.answerId),
    );

    return new SubmittedAnswersModel(answerModels);
  }

  private async validateSubmittedAnswers(
    pickExam: PickExamModel,
    submittedAnswers: SubmittedAnswersModel,
  ): Promise<true> {
    const submittedQuestionIds = submittedAnswers.answers.map(
      (answer) => answer.questionId,
    );
    const uniqueQuestionIds = new Set(submittedQuestionIds);

    if (submittedQuestionIds.length !== uniqueQuestionIds.size) {
      throw new BadRequestException(
        'Duplicate question answers detected. Each question can only be answered once.',
      );
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
    submitAnswer: SubmitAnswersBodyDto,
    reqAccountId: number,
  ): Promise<PickExamModel> {
    const submittedAnswers = this.convertDtoToSubmittedAnswers(submitAnswer);
    await this.validateSubmittedAnswers(pickExam, submittedAnswers);

    await this.getPickExamById(pickExam.id);

    await this.getPickExams(
      [pickExam.id],
      undefined,
      undefined,
      PickExamType.IN_PROGRESS,
      undefined,
      undefined,
      undefined,
    );

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
