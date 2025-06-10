import { Injectable } from '@nestjs/common';
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

  async findAll(): Promise<AccountModel[]> {
    const accounts = await this.accountRepository.find();
    return accounts.map((account: AccountEntity) => account.toModel());
  }

  async findById(accountId: number): Promise<AccountModel> {
    const account = await this.accountRepository.findOne({
      where: { id : accountId, deletedAt: IsNull() }, // only get non-deleted accounts
    });
    if (!account) {
      throw new Error('Account not found');
    }
    return account.toModel();
  }

  async create(
    username: string,
    password: string,
    roleId: number,
    reqAccountId: number,
  ): Promise<AccountEntity> {
    const entity = new AccountEntity();
    entity.username = username;
    entity.password = password;
    entity.roleId = roleId;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;

    return await this.accountRepository.save(entity);
  }

  async update(
    account: AccountModel,
    username: string | undefined,
    password: string | undefined,
    roleId: number | undefined,
    reqAccountId: number | undefined,
  ): Promise<AccountModel | null> {
    await this.accountRepository.update(
      {
        id: account.id,
      },
      {
        username: account.username,
        password: account.password,
        roleId: account.roleId,
      },
    );

    return await this.accountRepository.findOne({
      where: { id: account.id, deletedAt: IsNull() }, // only get non-deleted accounts
    });
  }

  async delete(accountId: number): Promise<AccountEntity | null> {
    return await this.accountRepository.findOne({
      where: { id: accountId, deletedAt: IsNull() },
    }); 
  }
}
