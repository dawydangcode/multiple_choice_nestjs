import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerEntity } from './entities/answer.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { AnswerModel } from './models/answer.model';
import { QuestionModel } from 'src/question/models/question.model';
import { QuestionService } from 'src/question/question.service';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    private readonly questionService: QuestionService,
  ) {}

  async getAnswers(
    answerIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<AnswerModel>> {
    const [answer, total] = await this.answerRepository.findAndCount({
      where: {
        id: answerIds ? In(answerIds) : undefined,
        content: search ? Like(`%${search}%`) : undefined,
        deletedAt: IsNull(),
      },
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<AnswerModel>(
      total,
      answer.map((answer: AnswerEntity) => answer.toModel()),
    );
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
