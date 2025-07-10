import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from './entities/answer.entity';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerEntity])],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
