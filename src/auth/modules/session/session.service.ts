import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entity/session.entity';
import { IsNull, Repository } from 'typeorm';
import { SessionModel } from './model/session.model';
import { AccountModel } from 'src/account/models/account.model';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async createSession(
    account: AccountModel,
    userAgent: string,
    ipAddress: string,
    reqAccountId: number,
  ): Promise<SessionModel> {
    const entity = new SessionEntity();

    entity.accountId = account.id;
    entity.userAgent = userAgent;
    entity.ipAddress = ipAddress;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;
    entity.isActive = true;

    const newSession = await this.sessionRepository.save(entity);
    return newSession.toModel();
  }

  async getSessionById(
    sessionId: number,
    isActive: boolean | undefined,
  ): Promise<SessionModel> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        isActive: isActive,
        deletedAt: IsNull(),
      },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    return session.toModel();
  }

  async updateActiveState(sessionId: number): Promise<SessionModel> {
    const session = await this.getSessionById(sessionId, true);

    if (!session) {
      throw new HttpException(
        'Session not found or already revoked',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.sessionRepository.update(
      {
        id: session.id,
        deletedAt: IsNull(),
      },
      {
        isActive: false,
        updatedAt: new Date(),
        updatedBy: session.accountId,
      },
    );
    return await this.getSessionById(session.id, false);
  }
}
