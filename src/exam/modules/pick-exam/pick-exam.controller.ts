import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PickExamService } from './pick-exam.service';
import {
  GetPickExamByIdBodyDto,
  StartPickExamBodyDto,
} from './dtos/pick-exam.dto';
import { SubmitAnswersBodyDto } from './dtos/submit-answers.dto';
import { UserService } from 'src/account/modules/user/user.service';
import { ExamService } from 'src/exam/exam.service';
import { RequestModel } from 'src/common/models/request.model';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { PickExamModel } from './models/pick-exam.model';

@Controller('api/v1/')
@ApiTags('Pick Exam')
@Roles(RoleType.User)
export class PickExamController {
  constructor(
    private readonly pickExamService: PickExamService,
    private readonly userService: UserService,
    private readonly examService: ExamService,
  ) {}

  @Get('pick-exam/:pickExamId/detail')
  async getPickExams(
    @Param('pickExamId') pickExamId: number,
  ): Promise<PickExamModel> {
    return await this.pickExamService.getPickExamById(pickExamId);
  }

  @Post('pick-exam/start')
  async startPickExam(
    @Req() req: RequestModel,
    @Body() body: StartPickExamBodyDto,
  ): Promise<PickExamModel> {
    const user = await this.userService.getUserById(req.user.accountId);
    const exam = await this.examService.getExamById(body.examId);

    return await this.pickExamService.startPickExam(
      exam,
      user,
      req.user.accountId,
    );
  }

  @Post('pick-exam/:pickExamId/submit')
  async submitExamWithAnswers(
    @Param() params: GetPickExamByIdBodyDto,
    @Body() body: SubmitAnswersBodyDto,
    @Req() req: RequestModel,
  ) {
    const pickExam = await this.pickExamService.getPickExamById(
      params.pickExamId,
    );
    return this.pickExamService.submitPickExamWithAnswers(
      pickExam,
      body,
      req.user.accountId,
    );
  }
}
