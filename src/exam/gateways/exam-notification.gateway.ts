import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/exam-notifications',
})
export class ExamNotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('ExamNotificationGateway');
  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(
          `Client ${client.id} attempted to connect without token`,
        );
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub || payload.id || payload.accountId;

      if (!userId) {
        this.logger.warn(
          `Client ${client.id} - No userId found in token payload`,
        );
        client.disconnect();
        return;
      }

      // Lưu mapping userId -> socketId
      this.userSockets.set(userId.toString(), client.id);
      client.data.userId = userId;

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);

      // Gửi thông báo kết nối thành công
      client.emit('connected', {
        message: 'Connected to exam notification service',
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.userSockets.delete(userId.toString());
    }
    this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
  }

  // Subscribe để client có thể join room theo examId
  @SubscribeMessage('joinExam')
  handleJoinExam(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { examId: string },
  ) {
    const { examId } = data;
    const userId = client.data.userId;

    client.join(`exam-${examId}`);
    this.logger.log(`User ${userId} joined exam room: exam-${examId}`);

    return {
      event: 'joinedExam',
      data: {
        examId,
        message: `Joined exam ${examId} successfully`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Subscribe để client có thể leave room
  @SubscribeMessage('leaveExam')
  handleLeaveExam(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { examId: string },
  ) {
    const { examId } = data;
    const userId = client.data.userId;

    client.leave(`exam-${examId}`);
    this.logger.log(`User ${userId} left exam room: exam-${examId}`);

    return {
      event: 'leftExam',
      data: {
        examId,
        message: `Left exam ${examId} successfully`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Gửi thông báo khi user bắt đầu làm bài
  notifyExamStarted(userId: string, examData: any) {
    const socketId = this.userSockets.get(userId.toString());
    if (socketId) {
      this.server.to(socketId).emit('examStarted', {
        message: 'Exam started successfully',
        data: examData,
        timestamp: new Date().toISOString(),
      });
      this.logger.log(`Sent exam started notification to user ${userId}`);
    }
  }

  // Gửi thông báo kết quả bài thi cho user cụ thể
  notifyExamResult(userId: string, resultData: any) {
    const socketId = this.userSockets.get(userId.toString());
    if (socketId) {
      this.server.to(socketId).emit('examResult', {
        message: 'Your exam has been graded',
        data: resultData,
        timestamp: new Date().toISOString(),
      });
      this.logger.log(`Sent exam result notification to user ${userId}`);
    }
  }

  // Gửi thông báo cho tất cả user đang tham gia một bài thi
  notifyExamRoom(examId: string, event: string, data: any) {
    this.server.to(`exam-${examId}`).emit(event, {
      data,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Sent ${event} notification to exam room: exam-${examId}`);
  }

  // Gửi cảnh báo thời gian còn lại
  notifyTimeWarning(examId: string, minutesRemaining: number) {
    this.server.to(`exam-${examId}`).emit('timeWarning', {
      message: `${minutesRemaining} minutes remaining`,
      minutesRemaining,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Sent time warning to exam room: exam-${examId}`);
  }

  // Gửi thông báo bài thi sắp hết hạn
  notifyExamExpiring(examId: string) {
    this.server.to(`exam-${examId}`).emit('examExpiring', {
      message: 'Exam is about to expire',
      timestamp: new Date().toISOString(),
    });
    this.logger.log(
      `Sent exam expiring notification to exam room: exam-${examId}`,
    );
  }
}
