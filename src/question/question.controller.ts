import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import {
  CreateQuestionBodyDto,
  GetQuestionByTopicParamsDto,
  GetQuestionParamsDto,
  GetQuestionsQueryDto,
  UpdateQuestionBodyDto,
  UpdateQuestionParamsDto,
} from './dtos/question.dto';
import { RequestModel } from 'src/common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorator/roles.decorator';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@Controller('api/v1')
@Roles(RoleType.Admin)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('question/list')
  async getQuestions(@Query() query: GetQuestionsQueryDto) {
    return await this.questionService.getQuestions(
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      query.q,
      undefined,
    );
  }

  @Get('question/:questionId/detail')
  async getQuestionById(@Param() params: GetQuestionParamsDto) {
    return await this.questionService.getQuestionById(params.questionId);
  }

  @Post('question/create')
  async createQuestion(
    @Req() req: RequestModel,
    @Body() body: CreateQuestionBodyDto,
  ) {
    const reqAccountId = req.user.accountId;
    return await this.questionService.createQuestion(
      body.topicId,
      body.content,
      body.points,
      reqAccountId,
    );
  }

  @Put('question/:questionId/update')
  async updateQuestion(
    @Req() req: RequestModel,
    @Param() params: UpdateQuestionParamsDto,
    @Body() body: UpdateQuestionBodyDto,
  ) {
    const reqAccountId = req.user.accountId;
    const question = await this.questionService.getQuestionById(
      params.questionId,
    );
    return await this.questionService.updateQuestion(
      question,
      body.topicId,
      body.content,
      body.points,
      reqAccountId,
    );
  }

  @Get('question/topic/:topicId/list')
  async getQuestionsByTopicId(@Param() params: GetQuestionByTopicParamsDto) {
    return await this.questionService.getQuestions(
      [params.topicId],
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }

  @Get('question/:questionId/question-answers')
  async getQuestionAnswers(@Param('questionId') questionId: number) {
    const question = await this.questionService.getQuestionById(questionId);
    return await this.questionService.getQuestionByIdWithAnswers(question);
  }
}
