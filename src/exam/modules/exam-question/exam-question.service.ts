import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { ExamQuestionEntity } from './entities/exam-question.entity';

@Injectable()
export class ExamQuestionService {
  constructor(
    @InjectRepository(ExamQuestionEntity)
    private readonly examQuestionRepository: typeof ExamQuestionEntity,
  ) {}

  
}
