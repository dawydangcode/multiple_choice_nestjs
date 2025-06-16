import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';
import * as bcrypt from 'bcrypt';
import { AccountEntity } from 'src/account/entities/account.entity';
import { AccountModel } from 'src/account/models/account.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountDetailService } from 'src/account/modules/account-detail/account-detail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly jwtService: JwtService,
    private readonly accountDetailService: AccountDetailService,
  ) {}

  async signUp(
    username: string,
    password: string,
    roleId: number,
  ): Promise<AccountModel> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const entity = new AccountEntity();
    entity.username = username;
    entity.password = hashedPassword;
    entity.createdAt = new Date();
    entity.roleId = roleId;

    const newAccount = await this.accountRepository.save(entity);

    await this.accountRepository.update(newAccount.id, {
      createdBy: newAccount.id,
    });

    await this.accountDetailService.createAccountDetail(
      newAccount.id,
      undefined,
      undefined,
      undefined,
      undefined,
    );

    return await this.accountService.getAccountByUsername(newAccount.username);
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.accountService.getAccountByUsername(username);

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
