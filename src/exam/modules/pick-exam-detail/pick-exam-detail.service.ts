import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PickExamDetailEntity } from './entities/pick-exam-deltail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PickExamDetailService {
  constructor(
    @InjectRepository(PickExamDetailEntity)
    private readonly pickExamDetailRepository: Repository<PickExamDetailEntity>,
  ) {}
}
