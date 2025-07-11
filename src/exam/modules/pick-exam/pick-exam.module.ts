import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickExamEntity } from './entities/pick-exam.entity';
import { PickExamController } from './pick-exam.controller';
import { PickExamService } from './pick-exam.service';
import { UserModule } from 'src/account/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PickExamEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [PickExamController],
  providers: [PickExamService],
  exports: [PickExamService],
})
export class PickExamModule {}
