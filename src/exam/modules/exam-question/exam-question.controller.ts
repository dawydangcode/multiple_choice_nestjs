import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExamQuestionService } from './exam-question.service';
import { ApiTags } from '@nestjs/swagger';
import { ExamService } from 'src/exam/exam.service';
import { QuestionService } from 'src/question/question.service';
import {
  AddQuestionsToExamBodyDto,
  RemoveQuestionFromExamParamsDto,
} from './dtos/exam-question.dto';

@Controller('api/v1/exam-questions')
@ApiTags('Exam Questions')
export class ExamQuestionController {
  constructor(
    private readonly examQuestionService: ExamQuestionService,
    private readonly examService: ExamService,
    private readonly questionService: QuestionService,
  ) {}

  @Post('exam/:examId/questions')
  async addQuestionsToExam(
    @Param('examId') examId: number,
    @Body() body: AddQuestionsToExamBodyDto,
  ) {
    return await this.examQuestionService.addQuestionsToExam(
      examId,
      body.questionIds,
    );
  }

  @Delete('exam/:examId/questions/:questionId')
  async removeQuestionFromExam(
    @Param() params: RemoveQuestionFromExamParamsDto,
  ) {
    const exam = await this.examService.getExamById(params.examId);
    const question = await this.questionService.getQuestionById(
      params.questionId,
    );
    return await this.examQuestionService.removeQuestionFromExam(
      exam,
      question,
    );
  }

  //   @Get('exam/:examId/questions')
  //   async getQuestionsByExam(@Param('examId') examId: number) {
  //     return await this.examQuestionService.getQuestionsByExam(examId);
  //   }

  //   @Put('exam/:examId/questions/order')
  //   async updateQuestionsOrder(
  //     @Param('examId') examId: number,
  //     @Body() body: UpdateQuestionsOrderDto,
  //   ) {
  //     return await this.examQuestionService.updateQuestionsOrder(
  //       examId,
  //       body.orders,
  //     );
  //   }

  //   @Get('question/:questionId/exams')
  //   async getExamsByQuestion(@Param('questionId') questionId: number) {
  //     return await this.examQuestionService.getExamsByQuestion(questionId);
  //   }
}
