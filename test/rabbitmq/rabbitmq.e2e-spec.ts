import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';

describe('RabbitMQ E2E Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/v1/rabbitmq (RabbitMQ endpoints)', () => {
    it('/health (GET) - should return RabbitMQ health status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/rabbitmq/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('service', 'RabbitMQ');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('/send-email (POST) - should send email job to queue', () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Email',
        template: 'test_template',
        context: { name: 'Test User' },
      };

      return request(app.getHttpServer())
        .post('/api/v1/rabbitmq/send-email')
        .send(emailData)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toContain('sent to queue');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('/process-data (POST) - should send data processing job to queue', () => {
      const processingData = {
        type: 'bulk_import',
        data: { items: [{ id: 1 }, { id: 2 }] },
        metadata: { requestId: 'test_123' },
      };

      return request(app.getHttpServer())
        .post('/api/v1/rabbitmq/process-data')
        .send(processingData)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.jobType).toBe('bulk_import');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('/notification (POST) - should send notification successfully', () => {
      const notificationData = {
        type: 'user_registered',
        data: { email: 'newuser@example.com', name: 'New User' },
      };

      return request(app.getHttpServer())
        .post('/api/v1/rabbitmq/notification')
        .send(notificationData)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.type).toBe('user_registered');
        });
    });

    it('/demo/welcome-email (POST) - should send welcome email notification', () => {
      const userData = {
        email: 'welcome@example.com',
        name: 'Welcome User',
      };

      return request(app.getHttpServer())
        .post('/api/v1/rabbitmq/demo/welcome-email')
        .send(userData)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toContain('Welcome email');
        });
    });

    it('/demo/exam-result (POST) - should send exam result notification', () => {
      const examData = {
        userEmail: 'student@example.com',
        examTitle: 'JavaScript Basics',
        score: 85,
        totalQuestions: 20,
      };

      return request(app.getHttpServer())
        .post('/api/v1/rabbitmq/demo/exam-result')
        .send(examData)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toContain('Exam result');
        });
    });

    it('/demo/bulk-import (POST) - should process bulk import job', () => {
      const importData = {
        items: [
          { name: 'Question 1', type: 'multiple' },
          { name: 'Question 2', type: 'single' },
        ],
      };

      return request(app.getHttpServer())
        .post('/api/v1/rabbitmq/demo/bulk-import')
        .send(importData)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.itemCount).toBe(2);
          expect(res.body.message).toContain('Bulk import job');
        });
    });

    it('/demo/generate-report (POST) - should generate report job', () => {
      const reportData = {
        reportType: 'exam_performance',
        filters: { dateFrom: '2024-01-01', dateTo: '2024-12-31' },
      };

      return request(app.getHttpServer())
        .post('/api/v1/rabbitmq/demo/generate-report')
        .send(reportData)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.reportType).toBe('exam_performance');
          expect(res.body.message).toContain('Report generation job');
        });
    });
  });

  describe('Rate Limiting Tests', () => {
    it('should enforce rate limits on email endpoints', async () => {
      const emailData = {
        to: 'rate-limit@example.com',
        subject: 'Rate Limit Test',
        template: 'test',
        context: {},
      };

      // Gửi 5 requests (limit là 5/phút)
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/api/v1/rabbitmq/send-email')
          .send(emailData)
          .expect(201);
      }

      // Request thứ 6 sẽ bị rate limit
      await request(app.getHttpServer())
        .post('/api/v1/rabbitmq/send-email')
        .send(emailData)
        .expect(429); // Too Many Requests
    });

    it('should enforce stricter rate limits on sync operations', async () => {
      const emailData = {
        to: 'sync-test@example.com',
        subject: 'Sync Test',
        template: 'test',
        context: {},
      };

      // Gửi 3 requests (limit là 3/phút cho sync)
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/api/v1/rabbitmq/send-email-sync')
          .send(emailData)
          .expect(201);
      }

      // Request thứ 4 sẽ bị rate limit
      await request(app.getHttpServer())
        .post('/api/v1/rabbitmq/send-email-sync')
        .send(emailData)
        .expect(429);
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent requests efficiently', async () => {
      const emailData = {
        to: 'performance@example.com',
        subject: 'Performance Test',
        template: 'test',
        context: {},
      };

      const startTime = Date.now();

      // Gửi 10 concurrent requests
      const promises = Array.from({ length: 10 }, () =>
        request(app.getHttpServer())
          .post('/api/v1/rabbitmq/send-email')
          .send(emailData),
      );

      const responses = await Promise.all(promises);
      const endTime = Date.now();

      // Tất cả requests đều thành công
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Thời gian xử lý không quá 5 giây
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should process large data efficiently', () => {
      const largeDataSet = {
        type: 'data_analysis',
        data: {
          records: Array.from({ length: 1000 }, (_, i) => ({
            id: i + 1,
            score: Math.floor(Math.random() * 100),
            timestamp: new Date().toISOString(),
          })),
        },
        metadata: { size: 'large' },
      };

      return request(app.getHttpServer())
        .post('/api/v1/rabbitmq/process-data')
        .send(largeDataSet)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.jobType).toBe('data_analysis');
        });
    });
  });
});
