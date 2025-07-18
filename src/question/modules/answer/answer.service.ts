import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerEntity } from './entities/answer.entity';
import { IsNull, Repository } from 'typeorm';
import { AnswerModel } from './models/answer.model';
import { QuestionModel } from 'src/question/models/question.model';
import { QuestionService } from 'src/question/question.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationUtil } from 'src/common/utils/pagination.util';
import { PaginationResponse } from 'src/common/models/pagination-response.model';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    private readonly questionService: QuestionService,
  ) {}

  async getAnswers(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<AnswerModel>> {
    const { search, sortBy = 'createAt', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.answerRepository
      .createQueryBuilder('answer')
      .where('answer.deletedAt IS NULL');

    if (search) {
      queryBuilder.andWhere('answer.content LIKE :search', {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy(`answer.${sortBy}`, sortOrder);

    const result = await PaginationUtil.paginate(queryBuilder, paginationDto);

    const answers = result.data.map((answer: AnswerEntity) => answer.toModel());

    return new PaginationResponse(answers, result.meta);
  }

  async getAnswerById(answerId: number): Promise<AnswerModel> {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId, deletedAt: IsNull() },
    });
    if (!answer) {
      throw new Error('Answer not found');
    }

    return answer.toModel();
  }

  async getAnswersByQuestionId(questionId: number): Promise<AnswerModel[]> {
    const answers = await this.answerRepository.find({
      where: {
        questionId: questionId,
        deletedAt: IsNull(),
      },
      order: { createdAt: 'ASC' },
    });

    return answers.map((answer: AnswerEntity) => answer.toModel());
  }

  async createAnswer(
    question: QuestionModel,
    content: string,
    isCorrect: boolean,
    reqAccountId: number,
  ): Promise<AnswerModel> {
    await this.questionService.getQuestionById(question.id);

    const entity = new AnswerEntity();
    entity.questionId = question.id;
    entity.content = content;
    entity.isCorrect = isCorrect;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;

    return await this.answerRepository.save(entity);
  }

  async updateAnswer(
    answer: AnswerModel,
    questionId: number | undefined,
    content: string | undefined,
    isCorrect: boolean | undefined,
    reqAccountId: number | undefined,
  ): Promise<AnswerModel> {
    await this.answerRepository.update(
      { id: answer.id, deletedAt: IsNull() },
      {
        questionId: questionId,
        content: content,
        isCorrect: isCorrect,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );

    return await this.getAnswerById(answer.id);
  }

  async deleteAnswer(
    answer: AnswerModel,
    reqAccountId: number | undefined,
  ): Promise<boolean> {
    await this.answerRepository.update(
      {
        id: answer.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );

    return true;
  }

  async getCorrectAnswersByQuestionId(
    questionId: number,
  ): Promise<AnswerModel[]> {
    const answers = await this.answerRepository.find({
      where: {
        questionId: questionId,
        isCorrect: true,
        deletedAt: IsNull(),
      },
    });

    return answers.map((answer: AnswerEntity) => answer.toModel());
  }
}
