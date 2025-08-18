import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailJobData } from '../rabbitmq.service';

@Controller()
export class EmailHandler {
  private readonly logger = new Logger(EmailHandler.name);

  @MessagePattern('send_email')
  async handleSendEmail(@Payload() data: EmailJobData) {
    try {
      this.logger.log(`Processing email job: ${JSON.stringify(data)}`);

      // Simulate email sending
      await this.simulateEmailSending(data);

      this.logger.log(`Email sent successfully to: ${data.to}`);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }

  @MessagePattern('send_email_sync')
  async handleSendEmailSync(@Payload() data: EmailJobData) {
    try {
      this.logger.log(`Processing sync email job: ${JSON.stringify(data)}`);

      await this.simulateEmailSending(data);

      return {
        success: true,
        message: 'Email sent successfully',
        emailId: `email_${Date.now()}`,
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to send sync email', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @MessagePattern('notification')
  async handleNotification(@Payload() data: any) {
    try {
      this.logger.log(`Processing notification: ${JSON.stringify(data)}`);

      // Xử lý thông báo tùy theo type
      switch (data.type) {
        case 'user_registered':
          await this.sendWelcomeEmail(data.data);
          break;
        case 'exam_completed':
          await this.sendExamResultEmail(data.data);
          break;
        case 'password_reset':
          await this.sendPasswordResetEmail(data.data);
          break;
        default:
          this.logger.warn(`Unknown notification type: ${data.type}`);
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Failed to process notification', error);
      throw error;
    }
  }

  @MessagePattern('health_check')
  async handleHealthCheck(@Payload() data: any) {
    this.logger.log('Email service health check received');
    return {
      status: 'healthy',
      service: 'email_handler',
      timestamp: new Date().toISOString(),
    };
  }

  private async simulateEmailSending(data: EmailJobData): Promise<void> {
    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Log email details (in real implementation, integrate with email service)
    this.logger.log(`
      📧 EMAIL SENT:
      To: ${data.to}
      Subject: ${data.subject}
      Template: ${data.template}
      Context: ${JSON.stringify(data.context || {})}
    `);
  }

  private async sendWelcomeEmail(userData: any): Promise<void> {
    await this.simulateEmailSending({
      to: userData.email,
      subject: 'Welcome to Multiple Choice App!',
      template: 'welcome',
      context: { name: userData.name },
    });
  }

  private async sendExamResultEmail(examData: any): Promise<void> {
    await this.simulateEmailSending({
      to: examData.userEmail,
      subject: 'Exam Results Available',
      template: 'exam_result',
      context: {
        examTitle: examData.examTitle,
        score: examData.score,
        totalQuestions: examData.totalQuestions,
      },
    });
  }

  private async sendPasswordResetEmail(resetData: any): Promise<void> {
    await this.simulateEmailSending({
      to: resetData.email,
      subject: 'Password Reset Request',
      template: 'password_reset',
      context: { resetToken: resetData.token },
    });
  }
}
