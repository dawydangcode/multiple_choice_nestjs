import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { AnswerService } from './answer.service';
import {
  CreateAnswerBodyDto,
  GetAnswerParamsDto,
  UpdateAnswerBodyDto,
  UpdateAnswerParamsDto,
} from './dtos/answer.dto';
import { RequestModel } from 'src/utils/models/request.model';
import { QuestionService } from 'src/question/question.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1')
@ApiTags('Question / Answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
  ) {}

  @Get('answer/list')
  async getAnswers() {
    return await this.answerService.getAnswers();
  }

  @Get('answer/:answerId/detail')
  async getAnswer(@Param() params: GetAnswerParamsDto) {
    return await this.answerService.getAnswerById(params.answerId);
  }

  @Post('answer/create')
  async createAnswer(
    @Req() req: RequestModel,
    @Body() body: CreateAnswerBodyDto,
  ) {
    const question = await this.questionService.getQuestionById(
      body.questionId,
    );
    return await this.answerService.createAnswer(
      question,
      body.content,
      body.isCorrect,
      req.user.accountId,
    );
  }

  @Put('answer/update')
  async updateAnswer(
    @Req() req: RequestModel,
    @Param() params: UpdateAnswerParamsDto,
    @Body() body: UpdateAnswerBodyDto,
  ) {}
}
