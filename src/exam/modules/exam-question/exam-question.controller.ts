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
  GetExamsByQuestionParamsDto,
  GetQuestionByExamParamsDto,
  RemoveQuestionFromExamParamsDto,
} from './dtos/exam-question.dto';

@Controller('api/v1/exam-questions')
@ApiTags('Exam-Questions')
export class ExamQuestionController {
  constructor(
    private readonly examQuestionService: ExamQuestionService,
    private readonly examService: ExamService,
    private readonly questionService: QuestionService,
  ) {}

  @Get('exam/:examId/questions')
  async getQuestionsByExam(@Param() params: GetQuestionByExamParamsDto) {
    const exam = await this.examService.getExamById(params.examId);
    return await this.examQuestionService.getQuestionsByExam(exam);
  }

  @Get('question/:questionId/exams')
  async getExamsByQuestion(@Param() params: GetExamsByQuestionParamsDto) {
    const question = await this.questionService.getQuestionById(
      params.questionId,
    );
    return await this.examQuestionService.getExamsByQuestion(question);
  }

  @Post('exam/:examId/addQuestions')
  async addQuestionsToExam(
    @Param('examId') examId: number,
    @Body() body: AddQuestionsToExamBodyDto,
  ) {
    const exam = await this.examService.getExamById(examId);
    return await this.examQuestionService.addQuestionsToExam(
      exam,
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
}
