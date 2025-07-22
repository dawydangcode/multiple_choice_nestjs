import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from './entities/question.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { QuestionModel } from './models/question.model';
import { TopicService } from 'src/topic/topic.service';
import { PaginationUtil } from 'src/common/utils/pagination.util';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PageList } from 'src/common/models/page-list.model';
import { AnswerModel } from './modules/answer/models/answer.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private readonly topicService: TopicService,
  ) {}

  async getQuestions(
    questionIds: number[] | undefined,
    topicIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<QuestionModel>> {
    const [questions, total] = await this.questionRepository.findAndCount({
      where: {
        id: questionIds ? In(questionIds) : undefined,
        content: Like(`%${search}%`),
        topicId: topicIds ? In(topicIds) : undefined,
        deletedAt: IsNull(),
      },
      ...pagination?.toQuery(),
      relations: relations,
    });

    return new PageList<QuestionModel>(
      total,
      questions.map((question: QuestionEntity) => question.toModel()),
    );
  }

  async getQuestionById(questionId: number): Promise<QuestionModel> {
    const question = (
      await this.getQuestions(
        [questionId],
        undefined,
        undefined,
        undefined,
        undefined,
      )
    ).data.pop();

    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  }

  async createQuestion(
    topicId: number,
    content: string,
    points: number,
    reqAccountId: number,
  ): Promise<QuestionModel> {
    const topic = await this.topicService.getTopicById(topicId);

    const entity = new QuestionEntity();
    entity.topicId = topic.id;
    entity.content = content;
    entity.points = points;
    entity.createdBy = reqAccountId;
    entity.createdAt = new Date();

    return await this.questionRepository.save(entity);
  }

  async updateQuestion(
    question: QuestionModel,
    topicId: number | undefined,
    content: string | undefined,
    points: number | undefined,
    reqAccountId: number | undefined,
  ): Promise<QuestionModel> {
    await this.questionRepository.update(
      { id: question.id, deletedAt: IsNull() },
      {
        topicId: topicId,
        content: content,
        points: points,
        updatedBy: reqAccountId,
        updatedAt: new Date(),
      },
    );

    return await this.getQuestionById(question.id);
  }

  async deleteQuestion(
    question: QuestionModel,
    reqAccountId: number,
  ): Promise<QuestionModel> {
    await this.questionRepository.update(
      { id: question.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );

    return await this.getQuestionById(question.id);
  }

  async getQuestionEntityById(
    //remove
    question: QuestionModel,
  ): Promise<QuestionEntity> {
    const questionEntity = await this.questionRepository.findOne({
      where: { id: question.id, deletedAt: IsNull() },
      relations: ['answers'],
    });

    if (!questionEntity) {
      throw new Error('Question not found');
    }

    return questionEntity;
  }

  async getQuestionByIdWithAnswers(question: QuestionModel) {
    const questionEntity = await this.getQuestionEntityById(question);

    const answers = (questionEntity.answers ?? [])
      .filter((answer) => answer.deletedAt === null)
      .map((answer) => answer.toModel());
    return {
      ...questionEntity.toModel(),
      answers,
    };
  }
}
