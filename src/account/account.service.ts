import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountModel } from './models/account.model';

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

  async create(
    username: string,
    password: string,
    roleId: number,
    reqAccountId: number,
  ): Promise<AccountEntity> {
    const entity = new AccountEntity();
    entity.userName = username;
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
    reqAccountId: number,
  ): Promise<AccountEntity> {
    await this.accountRepository.update(
      {
        id: account.id,
        deletedAt: IsNull(),
      },
<<<<<<< HEAD
    });
    if (!existingAccount) {
      throw new Error('Account not found');
    }
    existingAccount.username = account.username;
    existingAccount.password = account.password;
    existingAccount.updatedAt = new Date();
    existingAccount.updatedBy = account.updatedBy;
    existingAccount.roleId = account.roleId;
    return this.accountRepository.save(existingAccount);
=======
      {
        userName: username,
        password: password,
        roleId: roleId,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );

    return await this.findAll();
>>>>>>> aa3c5d834337f3214146de665887fbc671cceb0e
  }
}
