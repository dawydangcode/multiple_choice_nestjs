import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  RabbitMQService,
  EmailJobData,
  DataProcessingJobData,
} from './rabbitmq.service';
import { Throttle } from '../common/middleware/throttle.guard';

@ApiTags('RabbitMQ Demo')
@Controller('api/v1/rabbitmq')
export class RabbitMQController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('send-email')
  @ApiOperation({ summary: 'Send email job to queue' })
  @ApiResponse({
    status: 201,
    description: 'Email job sent to queue successfully',
  })
  @Throttle(5, 60000) // Tối đa 5 request/phút
  async sendEmailJob(@Body() emailData: EmailJobData) {
    await this.rabbitMQService.sendEmailJob(emailData);
    return {
      success: true,
      message: 'Email job sent to queue successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('send-email-sync')
  @ApiOperation({ summary: 'Send email job and wait for response' })
  @ApiResponse({ status: 201, description: 'Email sent successfully' })
  @Throttle(3, 60000) // Tối đa 3 request/phút cho sync operation
  async sendEmailJobSync(@Body() emailData: EmailJobData) {
    const result =
      await this.rabbitMQService.sendEmailJobWithResponse(emailData);
    return {
      success: true,
      result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('process-data')
  @ApiOperation({ summary: 'Send data processing job to queue' })
  @ApiResponse({
    status: 201,
    description: 'Data processing job sent to queue successfully',
  })
  @Throttle(10, 60000) // Tối đa 10 request/phút
  async sendDataProcessingJob(@Body() processingData: DataProcessingJobData) {
    await this.rabbitMQService.sendDataProcessingJob(processingData);
    return {
      success: true,
      message: 'Data processing job sent to queue successfully',
      jobType: processingData.type,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('notification')
  @ApiOperation({ summary: 'Send notification' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully' })
  @Throttle(20, 60000) // Tối đa 20 notifications/phút
  async sendNotification(
    @Body() notificationData: { type: string; data: any },
  ) {
    await this.rabbitMQService.sendNotification(
      notificationData.type,
      notificationData.data,
    );
    return {
      success: true,
      message: 'Notification sent successfully',
      type: notificationData.type,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Check RabbitMQ health' })
  @ApiResponse({ status: 200, description: 'RabbitMQ health status' })
  async healthCheck() {
    const isHealthy = await this.rabbitMQService.healthCheck();
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      service: 'RabbitMQ',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('demo/welcome-email')
  @ApiOperation({ summary: 'Demo: Send welcome email' })
  async demoWelcomeEmail(@Body() userData: { email: string; name: string }) {
    await this.rabbitMQService.sendNotification('user_registered', userData);
    return {
      success: true,
      message: 'Welcome email notification sent',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('demo/exam-result')
  @ApiOperation({ summary: 'Demo: Send exam result email' })
  async demoExamResult(
    @Body()
    examData: {
      userEmail: string;
      examTitle: string;
      score: number;
      totalQuestions: number;
    },
  ) {
    await this.rabbitMQService.sendNotification('exam_completed', examData);
    return {
      success: true,
      message: 'Exam result notification sent',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('demo/bulk-import')
  @ApiOperation({ summary: 'Demo: Process bulk import' })
  async demoBulkImport(@Body() importData: { items: any[] }) {
    await this.rabbitMQService.sendDataProcessingJob({
      type: 'bulk_import',
      data: importData,
      metadata: { requestId: `import_${Date.now()}` },
    });
    return {
      success: true,
      message: 'Bulk import job submitted',
      itemCount: importData.items?.length || 0,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('demo/generate-report')
  @ApiOperation({ summary: 'Demo: Generate report' })
  async demoGenerateReport(
    @Body() reportData: { reportType: string; filters?: any },
  ) {
    await this.rabbitMQService.sendDataProcessingJob({
      type: 'report_generation',
      data: reportData,
      metadata: { requestId: `report_${Date.now()}` },
    });
    return {
      success: true,
      message: 'Report generation job submitted',
      reportType: reportData.reportType,
      timestamp: new Date().toISOString(),
    };
  }
}
