import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickExamEntity } from './entities/pick-exam.entity';
import { PickExamController } from './pick-exam.controller';
import { PickExamService } from './pick-exam.service';

@Module({
  imports: [TypeOrmModule.forFeature([PickExamEntity])],
  controllers: [PickExamController],
  providers: [PickExamService],
  exports: [PickExamService],
})
export class PickExamModule {}
