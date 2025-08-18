import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context?: any;
}

export interface DataProcessingJobData {
  type: string;
  data: any;
  metadata?: any;
}

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy,
    @Inject('DATA_PROCESSING_SERVICE')
    private readonly dataProcessingClient: ClientProxy,
  ) {}

  // Gửi job email bất đồng bộ
  async sendEmailJob(jobData: EmailJobData): Promise<void> {
    try {
      this.logger.log(`Sending email job: ${JSON.stringify(jobData)}`);
      this.emailClient.emit('send_email', jobData);
    } catch (error) {
      this.logger.error('Failed to send email job', error);
      throw error;
    }
  }

  // Gửi job xử lý dữ liệu lớn
  async sendDataProcessingJob(jobData: DataProcessingJobData): Promise<void> {
    try {
      this.logger.log(
        `Sending data processing job: ${JSON.stringify(jobData)}`,
      );
      this.dataProcessingClient.emit('process_data', jobData);
    } catch (error) {
      this.logger.error('Failed to send data processing job', error);
      throw error;
    }
  }

  // Gửi job và chờ phản hồi
  async sendEmailJobWithResponse(jobData: EmailJobData): Promise<any> {
    try {
      this.logger.log(
        `Sending email job with response: ${JSON.stringify(jobData)}`,
      );
      return await firstValueFrom(
        this.emailClient.send('send_email_sync', jobData),
      );
    } catch (error) {
      this.logger.error('Failed to send email job with response', error);
      throw error;
    }
  }

  // Gửi thông báo
  async sendNotification(type: string, data: any): Promise<void> {
    try {
      this.logger.log(`Sending notification: ${type}`);
      this.emailClient.emit('notification', {
        type,
        data,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error('Failed to send notification', error);
      throw error;
    }
  }

  // Health check cho RabbitMQ connections
  async healthCheck(): Promise<boolean> {
    try {
      // Thử gửi một message test
      await firstValueFrom(
        this.emailClient.send('health_check', { timestamp: new Date() }),
      );
      return true;
    } catch (error) {
      this.logger.error('RabbitMQ health check failed', error);
      return false;
    }
  }
}
