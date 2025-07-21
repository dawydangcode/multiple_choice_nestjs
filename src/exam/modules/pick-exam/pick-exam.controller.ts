import { Body, Controller, Get, Post, Req, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PickExamService } from './pick-exam.service';
import { StartPickExamBodyDto } from './dtos/pick-exam.dto';
import { SubmitAnswersDto, SaveAnswersDto } from './dtos/submit-answers.dto';
import { UserService } from 'src/account/modules/user/user.service';
import { ExamService } from 'src/exam/exam.service';
import { RequestModel } from 'src/common/models/request.model';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@Roles(RoleType.User)
@Controller('api/v1/pick-exam')
@ApiTags('Pick Exam')
export class PickExamController {
  constructor(
    private readonly pickExamService: PickExamService,
    private readonly userService: UserService,
    private readonly examService: ExamService,
  ) {}

  @Get('pick-exam/:pickExamId/detail')
  async getPickExams(@Param('pickExamId') pickExamId: number) {
    return await this.pickExamService.getPickExamById(pickExamId);
  }

  @Post('pick-exam/start')
  async startPickExam(
    @Req() req: RequestModel,
    @Body() body: StartPickExamBodyDto,
  ) {
    const user = await this.userService.getUserById(req.user.accountId);
    const exam = await this.examService.getExamById(body.examId);

    return await this.pickExamService.startPickExam(
      exam,
      user,
      req.user.accountId,
    );
  }

  @Post(':pickExamId/submit')
  async submitExamWithAnswers(
    @Param('pickExamId') pickExamId: number,
    @Body() submitData: SubmitAnswersDto,
    @Req() req: RequestModel,
  ) {
    return this.pickExamService.submitPickExamWithAnswers(
      pickExamId,
      submitData,
      req.user.accountId,
    );
  }

  @Get(':pickExamId/answers')
  async getUserAnswers(@Param('pickExamId') pickExamId: number) {
    return this.pickExamService.getUserAnswers(pickExamId);
  }

  @Get(':pickExamId/results')
  async getDetailedResults(@Param('pickExamId') pickExamId: number) {
    return this.pickExamService.getDetailedResults(pickExamId);
  }
}
