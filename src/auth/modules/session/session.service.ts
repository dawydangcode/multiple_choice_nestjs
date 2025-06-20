import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entity/session.entity';
import { IsNull, Repository } from 'typeorm';
import { SessionModel } from './model/session.model';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async createSession(
    accountId: number,
    userAgent: string,
    ipAddress: string,
  ): Promise<SessionModel> {
    const entity = new SessionEntity();

    entity.accountId = accountId;
    entity.userAgent = userAgent;
    entity.ipAddress = ipAddress;
    entity.createdAt = new Date();
    entity.createdBy = accountId;
    entity.isActive = false;

    const newSession = await this.sessionRepository.save(entity);
    return newSession.toModel();
  }

  async getSessionById(sessionId: number): Promise<SessionModel> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        isActive: false,
        deletedAt: IsNull(),
      },
    });

    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    return session.toModel();
  }

  async revokeSession(sessionId: number): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        isActive: false,
      },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    session.isActive = true;
    await this.sessionRepository.save(session);
  }
}
