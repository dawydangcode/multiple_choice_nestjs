import { Injectable } from '@nestjs/common';
import { ExamEntity } from './entities/exam.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamModel } from './models/exam.model';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>,
  ) {}

  async getExams(): Promise<ExamModel[]> {
    const exams = await this.examRepository.find({
      where: { deletedAt: IsNull() },
    });

    return exams.map((exam: ExamEntity) => exam.toModel());
  }

  async getExamById(examId: number): Promise<ExamModel> {
    const exam = await this.examRepository.findOne({
      where: { id: examId, deletedAt: IsNull() },
    });
    if (!exam) {
      throw new Error('Exam not found');
    }
    return exam.toModel();
  }

  async createExam(
    title: string,
    minuteDuration: number,
    description: string,
    isActive: boolean,
    reqAccountId: number,
  ) {
    const entity = new ExamEntity();
    entity.title = title;
    entity.minuteDuration = minuteDuration;
    entity.description = description;
    entity.isActive = isActive;
    entity.createdBy = reqAccountId;
    entity.createdAt = new Date();

    const savedExam = await this.examRepository.save(entity);
    return savedExam.toModel();
  }

  async updateExam(
    exam: ExamModel,
    title: string | undefined,
    minuteDuration: number | undefined,
    description: string | undefined,
    isActive: boolean | undefined,
    reqAccountId: number | undefined,
  ): Promise<ExamModel> {
    await this.examRepository.update(
      { id: exam.id, deletedAt: IsNull() },
      {
        title: title,
        minuteDuration: minuteDuration,
        description: description,
        isActive: isActive,
        updatedBy: reqAccountId,
        updatedAt: new Date(),
      },
    );
    return this.getExamById(exam.id);
  }

  async deleteExam(exam: ExamModel, reqAccountId: number): Promise<boolean> {
    await this.examRepository.update(
      { id: exam.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );
    return true;
  }

  async deActiveExam(exam: ExamModel, reqAccountId: number): Promise<boolean> {
    await this.examRepository.update(
      { id: exam.id, deletedAt: IsNull() },
      {
        isActive: false,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );
    return true;
  }

  async activeExam(exam: ExamModel, reqAccountId: number): Promise<boolean> {
    await this.examRepository.update(
      { id: exam.id, deletedAt: IsNull() },
      {
        isActive: true,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );
    return true;
  }
}
