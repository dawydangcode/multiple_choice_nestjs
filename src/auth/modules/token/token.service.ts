import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './entity/token.entity';
import { IsNull, Repository, ReturnDocument } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { TokenModel } from './model/token.model';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly accountService: AccountService,
  ) {}

  async getToken(tokenId: number): Promise<TokenEntity> {
    const token = await this.tokenRepository.findOne({
      where: { id: tokenId },
    });
    if (!token) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    return token;
  }

  async createToken(
    accountId: number,
    accessToken: string,
    expiresAt: Date,
    refreshExpiresAt: Date,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
    sessionId?: string,
  ): Promise<TokenModel> {
    const entity = new TokenEntity();

    entity.accountId = accountId;
    entity.accessToken = accessToken;
    entity.expiresAt = expiresAt;
    entity.refreshExpiresAt = refreshExpiresAt;
    entity.refreshToken = refreshToken;
    entity.userAgent = userAgent;
    entity.ipAddress = ipAddress;
    entity.sessionId = sessionId;
    entity.createdAt = new Date();
    entity.createdBy = accountId;
    entity.isRevoked = false;

    const newToken = await this.tokenRepository.save(entity);
    return newToken.toModel();
  }

  async getLatestTokenByAccountId(
    accountId: number,
    isRevoked: boolean,
  ): Promise<TokenModel> {
    const token = await this.tokenRepository.findOne({
      where: {
        accountId: accountId,
        isRevoked: isRevoked,
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!token) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }

    return token.toModel();
  }

  async updateToken(
    tokenId: number,
    accountId: number,
    accessToken: string,
    expiresAt: Date,
    refreshExpiresAt: Date,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
    sessionId?: string,
  ): Promise<TokenEntity> {
    const token = await this.getToken(tokenId);

    token.accountId = accountId;
    token.accessToken = accessToken;
    token.expiresAt = expiresAt;
    token.refreshExpiresAt = refreshExpiresAt;
    token.refreshToken = refreshToken;
    token.userAgent = userAgent;
    token.ipAddress = ipAddress;
    token.sessionId = sessionId;

    return await this.tokenRepository.save(token);
  }
}
