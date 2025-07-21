import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickExamEntity } from './entities/pick-exam.entity';
import { PickExamController } from './pick-exam.controller';
import { PickExamService } from './pick-exam.service';
import { UserModule } from 'src/account/modules/user/user.module';
import { ExamModule } from 'src/exam/exam.module';
import { PickExamDetailModule } from '../pick-exam-detail/pick-exam-detail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PickExamEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => ExamModule),
    forwardRef(() => PickExamDetailModule),
  ],
  controllers: [PickExamController],
  providers: [PickExamService],
  exports: [PickExamService],
})
export class PickExamModule {}
