import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from './entities/question.entity';
import { In, IsNull, Repository } from 'typeorm';
import { QuestionModel } from './models/question.model';
import { TopicService } from 'src/topic/topic.service';
import { PaginationUtil } from 'src/common/utils/pagination.util';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationResponse } from 'src/common/models/pagination-response.model';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private readonly topicService: TopicService,
  ) {}

  async getQuestions(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<QuestionModel>> {
    const { search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .where('question.deletedAt IS NULL');

    if (search) {
      queryBuilder.andWhere('question.content LIKE :search', {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy(`question.${sortBy}`, sortOrder);

    const result = await PaginationUtil.paginate(queryBuilder, paginationDto);

    const questions = result.data.map((question: QuestionEntity) =>
      question.toModel(),
    );

    return new PaginationResponse(questions, result.meta);
  }

  async getQuestionById(questionId: number): Promise<QuestionModel> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId, deletedAt: IsNull() },
    });
    if (!question) {
      throw new Error('Question not found');
    }
    return question.toModel();
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

  async getQuestionsByTopicId(topicId: number): Promise<QuestionModel[]> {
    const questions = await this.questionRepository.find({
      where: {
        topicId: topicId,
        deletedAt: IsNull(),
      },
    });

    return questions.map((question: QuestionEntity) => question.toModel());
  }

  async getQuestionsByIds(questionIds: number[]): Promise<QuestionModel[]> {
    const questions = await this.questionRepository.find({
      where: {
        id: In(questionIds),
        deletedAt: IsNull(),
      },
    });

    return questions.map((question: QuestionEntity) => question.toModel());
  }
}
