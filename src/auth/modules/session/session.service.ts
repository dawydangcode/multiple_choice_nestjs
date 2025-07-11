import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entity/session.entity';
import { IsNull, Repository } from 'typeorm';
import { SessionModel } from './model/session.model';
import { AccountModel } from 'src/account/models/account.model';
import { SessionType } from './enums/session.type';

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
    type: SessionType | undefined,
    reqAccountId: number,
  ): Promise<SessionModel> {
    const entity = new SessionEntity();

    entity.accountId = account.id;
    entity.userAgent = userAgent;
    entity.ipAddress = ipAddress;
    entity.type = type;
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

  async updateSession(
    session: SessionModel,
    isActive: boolean,
    type: SessionType | undefined,
    reqAccountId: number,
  ): Promise<SessionModel> {
    await this.sessionRepository.update(
      {
        id: session.id,
        deletedAt: IsNull(),
      },
      {
        isActive: isActive,
        type: type,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );

    return await this.getSessionById(session.id, undefined);
  }

  async invalidateAllSessionsForAccount(accountId: number): Promise<void> {
    await this.sessionRepository.update(
      {
        accountId: accountId,
        isActive: true,
        deletedAt: IsNull(),
      },
      {
        isActive: false,
        type: undefined,
        updatedAt: new Date(),
        updatedBy: accountId,
      },
    );
  }
}
