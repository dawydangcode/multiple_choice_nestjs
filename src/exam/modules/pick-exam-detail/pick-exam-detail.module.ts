import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickExamDetailEntity } from './entities/pick-exam-detail.entity';
import { PickExamDetailController } from './pick-exam-detail.controller';
import { PickExamDetailService } from './pick-exam-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([PickExamDetailEntity])],
  controllers: [PickExamDetailController],
  providers: [PickExamDetailService],
  exports: [PickExamDetailService],
})
export class PickExamDetailModule {}
