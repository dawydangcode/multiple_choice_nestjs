import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server!: Server;

  sendResult(userId: number, result: any) {
    this.server.to(`user_${userId}`).emit('examResult', result);
  }
}
