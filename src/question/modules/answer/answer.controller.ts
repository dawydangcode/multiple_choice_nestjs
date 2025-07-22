import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import {
  CreateAnswerBodyDto,
  GetAnswerParamsDto,
  UpdateAnswerBodyDto,
  UpdateAnswerParamsDto,
} from './dtos/answer.dto';
import { RequestModel } from 'src/common/models/request.model';
import { QuestionService } from 'src/question/question.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('api/v1')
@ApiTags('Question / Answer')
@Roles(RoleType.Admin)
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
  ) {}

  @Get('answer/list')
  async getAnswers(@Body() paginationDto: PaginationDto) {
    return await this.answerService.getAnswers(paginationDto);
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

  @Put('answer/:answerId/update')
  async updateAnswer(
    @Req() req: RequestModel,
    @Param() params: UpdateAnswerParamsDto,
    @Body() body: UpdateAnswerBodyDto,
  ) {
    const answer = await this.answerService.getAnswerById(params.answerId);
    return await this.answerService.updateAnswer(
      answer,
      body.questionId,
      body.content,
      body.isCorrect,
      req.user.accountId,
    );
  }

  @Delete('answer/:answerId/delete')
  async deleteAnswer(
    @Req() req: RequestModel,
    @Param() params: GetAnswerParamsDto,
  ) {
    const answer = await this.answerService.getAnswerById(params.answerId);
    return this.answerService.deleteAnswer(answer, req.user.accountId);
  }
}
