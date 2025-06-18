import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entity/session.entity';
import { Repository } from 'typeorm';
import { CreateSessionBodyDto } from './dto/session.dto';
import { SessionModel } from './model/session.model';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async createSession(
    @Body() body: CreateSessionBodyDto,
  ): Promise<SessionModel> {
    const entity = new SessionEntity();

    entity.accountId = body.accountId;
    entity.sessionId = body.sessionId;
    entity.userAgent = body.userAgent;
    entity.ipAddress = body.ipAddress;
    entity.createdAt = new Date();
    entity.createdBy = body.accountId;
    entity.isRevoked = false;

    const newSession = await this.sessionRepository.save(entity);
    return newSession.toModel();
  }

  async getSessionById(id: number): Promise<SessionModel> {
    const session = await this.sessionRepository.findOne({
      where: { id, isRevoked: false },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return session.toModel();
  }

  async getSessionBySessionId(sessionId: string): Promise<SessionModel> {
    const session = await this.sessionRepository.findOne({
      where: { sessionId: Number(sessionId), isRevoked: false },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return session.toModel();
  }

  async revokeSession(id: number): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { id, isRevoked: false },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    session.isRevoked = true;
    await this.sessionRepository.save(session);
  }
}
