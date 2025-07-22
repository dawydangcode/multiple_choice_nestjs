import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PickExamDetailService } from './pick-exam-detail.service';

@Controller('api/v1/pick-exam')
@ApiTags('Pick Exam Detail')
export class PickExamDetailController {
  constructor(private readonly pickExamDetailService: PickExamDetailService) {}

  @Get(':pickExamId/detail')
  async getPickExamDetailsByExamId(@Param() params: any) {
    return await this.pickExamDetailService.getPickExamDetailsByPickExamId(
      params,
    );
  }
}
