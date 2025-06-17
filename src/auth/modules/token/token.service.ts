import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './entity/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async createToken(
    accountId: number,
    accessToken: string,
    expiresAt: Date,
    refreshExpiresAt: Date,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
    sessionId?: string,
  ): Promise<TokenEntity> {
    const newToken = this.tokenRepository.create({
      accountId: accountId,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
      refreshExpiresAt: refreshExpiresAt,
      userAgent: userAgent,
      ipAddress: ipAddress,
      sessionId: sessionId,
      isRevoked: false,
      createdAt: new Date(),
    });

    return await this.tokenRepository.save(newToken);
  }
}
