import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  create(account: AccountEntity): Promise<AccountEntity> {
    account.createdAt = new Date();
    account.updatedAt = new Date();
    return this.accountRepository.save(account);
  }

  async update(id: number, account: AccountEntity): Promise<AccountEntity> {
    const existingAccount = await this.accountRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!existingAccount) {
      throw new Error('Account not found');
    }
    existingAccount.userName = account.userName;
    existingAccount.password = account.password;
    existingAccount.updatedAt = new Date();
    existingAccount.updatedBy = account.updatedBy;
    existingAccount.roleId = account.roleId;
    return this.accountRepository.save(existingAccount);
  }
}
