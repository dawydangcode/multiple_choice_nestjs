import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ExamQuestionService } from './exam-question.service';
import { ApiTags } from '@nestjs/swagger';
import { ExamService } from 'src/exam/exam.service';
import { QuestionService } from 'src/question/question.service';
import {
  AddQuestionsToExamBodyDto,
  AddQuestionToExamParamsDto,
  RemoveQuestionFromExamParamsDto,
} from './dtos/exam-question.dto';
import { RequestModel } from 'src/common/models/request.model';

@Controller('api/v1')
@ApiTags('Exam / Exam Questions')
export class ExamQuestionController {
  constructor(
    private readonly examQuestionService: ExamQuestionService,
    private readonly examService: ExamService,
    private readonly questionService: QuestionService,
  ) {}

  @Post('exam/:examId/questions/add')
  async addQuestionsToExam(
    @Req() req: RequestModel,
    @Param() params: AddQuestionToExamParamsDto,
    @Body() body: AddQuestionsToExamBodyDto,
  ) {
    const exam = await this.examService.getExamById(params.examId);
    return await this.examQuestionService.addQuestionsToExam(
      exam,
      body.questionIds,
      req.user.accountId,
    );
  }

  @Delete('exam/:examId/question/:questionId/remove')
  async deleteQuestionFromExam(
    @Req() req: RequestModel,
    @Param() params: RemoveQuestionFromExamParamsDto,
  ) {
    const exam = await this.examService.getExamById(params.examId);
    const question = await this.questionService.getQuestionById(
      params.questionId,
    );

    return await this.examQuestionService.deleteQuestionFromExam(
      exam,
      question,
      req.user.accountId,
    );
  }
}
