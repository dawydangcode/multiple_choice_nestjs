import { Module, forwardRef } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], //TO DO
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
