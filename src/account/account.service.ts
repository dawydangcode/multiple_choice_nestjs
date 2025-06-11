import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountModel } from './models/account.model';
import { isNull } from 'util';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async getAccounts(): Promise<AccountModel[]> {
    const accounts = await this.accountRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
    return accounts.map((account: AccountEntity) => account.toModel());
  }

  async getAccount(accountId: number): Promise<AccountModel> {
    const account = await this.accountRepository.findOne({
      where: {
        id: accountId,
        deletedAt: IsNull(),
      },
    });
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
    return account.toModel();
  }

  async createAccount(
    username: string,
    password: string,
    roleId: number,
    reqAccountId: number,
  ): Promise<AccountModel> {
    const entity = new AccountEntity();
    entity.username = username;
    entity.password = password;
    entity.roleId = roleId;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;
    const newAccount = await this.accountRepository.save(entity);
    return await this.getAccount(newAccount.id);
  }

  async updateAccount(
    account: AccountModel,
    username: string | undefined,
    password: string | undefined,
    roleId: number | undefined,
    reqAccountId: number | undefined,
  ): Promise<AccountModel> {
    await this.accountRepository.update(
      {
        id: account.id,
        deletedAt: IsNull(),
      },
      {
        username: username,
        password: password,
        roleId: roleId,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );

    return await this.getAccount(account.id);
  }

  async deleteAccount(account: AccountModel): Promise<boolean> {
    await this.accountRepository.update(
      {
        id: account.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: 1,
      },
    );
    return true;
  }
}
