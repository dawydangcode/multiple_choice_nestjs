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
import { ExamService } from './exam.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestModel } from 'src/common/models/request.model';
import { ExamModel } from './models/exam.model';
import {
  CreateExamBodyDto,
  GetExamDto,
  UpdateExamBodyDto,
} from './dtos/exam.dto';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationResponse } from 'src/common/models/pagination-response.model';

@Controller('api/v1')
@ApiTags('Exam')
@Roles(RoleType.Admin)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get('exam/list')
  @ApiResponse({
    type: ExamModel,
  })
  async getExams(
    @Body() paginationDto: PaginationDto,
  ): Promise<PaginationResponse<ExamModel>> {
    return this.examService.getExams(paginationDto);
  }

  @Get('exam/:examId/detail')
  async getExam(@Param() params: GetExamDto): Promise<ExamModel> {
    return this.examService.getExamById(params.examId);
  }

  @Post('exam/create')
  async createExam(
    @Req() req: RequestModel,
    @Body() body: CreateExamBodyDto,
  ): Promise<ExamModel> {
    const reqAccountId = req.user.accountId;

    return this.examService.createExam(
      body.title,
      body.minuteDuration,
      body.description,
      body.isActive,
      reqAccountId,
    );
  }

  @Put('exam/:examId/update')
  async updateExam(
    @Req() req: RequestModel,
    @Param() params: GetExamDto,
    @Body() body: UpdateExamBodyDto,
  ): Promise<ExamModel> {
    const reqAccountId = req.user.accountId;
    const exam = await this.examService.getExamById(params.examId);

    return this.examService.updateExam(
      exam,
      body.title,
      body.minuteDuration,
      body.description,
      body.isActive,
      reqAccountId,
    );
  }

  @Delete('exam/:examId/delete')
  async deleteExam(
    @Req() req: RequestModel,
    @Param() params: GetExamDto,
  ): Promise<boolean> {
    const reqAccountId = req.user.accountId;
    const exam = await this.examService.getExamById(params.examId);

    return this.examService.deleteExam(exam, reqAccountId);
  }

  @Get('exam/:examId/questions-with-answers')
  async getExamWithQuestionsAndAnswers(@Param() params: GetExamDto) {
    const exam = await this.examService.getExamById(params.examId);
    return this.examService.getExamWithQuestionsAndAnswersById(exam);
  }
}
