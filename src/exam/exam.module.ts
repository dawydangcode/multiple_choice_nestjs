import { forwardRef, Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamEntity } from './entities/exam.entity';
import { ExamQuestionModule } from './modules/exam-question/exam-question.module';
import { QuestionModule } from 'src/question/question.module';
import { ExamNotificationGateway } from './gateways/exam-notification.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamEntity]),
    forwardRef(() => ExamQuestionModule),
    forwardRef(() => QuestionModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
      }),
    }),
  ],
  controllers: [ExamController],
  providers: [ExamService, ExamNotificationGateway],
  exports: [ExamService, ExamNotificationGateway],
})
export class ExamModule {}
