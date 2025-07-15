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
import { ApiTags } from '@nestjs/swagger';
import { RequestModel } from 'src/utils/models/request.model';
import { ExamModel } from './models/exam.model';
import {
  CreateExamBodyDto,
  GetExamDto,
  UpdateExamBodyDto,
} from './dtos/exam.dto';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@Controller('api/v1')
@ApiTags('Exam')
@Roles(RoleType.Admin)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get('exam/list')
  async getExams(): Promise<ExamModel[]> {
    return this.examService.getExams();
  }

  @Get('exam/:examId/detail')
  async getExam(@Param() params: GetExamDto) {
    return this.examService.getExamById(params.examId);
  }

  @Post('exam/create')
  async createExam(@Req() req: RequestModel, @Body() body: CreateExamBodyDto) {
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
  ) {
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

  @Put('exam/:examId/deactivate')
  async deActiveExam(@Req() req: RequestModel, @Param() params: GetExamDto) {
    const reqAccountId = req.user.accountId;
    const exam = await this.examService.getExamById(params.examId);

    return this.examService.deActiveExam(exam, reqAccountId); //update
  }

  @Put('exam/:examId/active')
  async activeExam(@Req() req: RequestModel, @Param() params: GetExamDto) {
    const reqAccountId = req.user.accountId;
    const exam = await this.examService.getExamById(params.examId);

    return this.examService.activeExam(exam, reqAccountId); //update
  }

  @Delete('exam/:examId/delete')
  async deleteExam(@Req() req: RequestModel, @Param() params: GetExamDto) {
    const reqAccountId = req.user.accountId;
    const exam = await this.examService.getExamById(params.examId);

    return this.examService.deleteExam(exam, reqAccountId);
  }
}
