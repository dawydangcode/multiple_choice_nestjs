import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountModel } from './models/account.model';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/auth/constants/auth.const';
import { DEFAULT_ROLE_ID } from 'src/utils/constant';
import { ConfigService } from '@nestjs/config';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly roleService: RoleService,
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

  async getAccountByUsername(username: string): Promise<AccountModel> {
    const account = await this.checkExistUsername(username);

    if (!account) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND); //TO DO
    }

    return account.toModel();
  }

  async checkExistUsername(username: string) {
    const existingUsername = this.accountRepository.findOne({
      where: { username: username, deletedAt: IsNull() },
    });
    return existingUsername;
  }

  async createAccount(
    username: string,
    password: string,
    roleId: number | undefined,
    reqAccountId: number | undefined,
  ): Promise<AccountModel> {
    const existingAccount = await this.checkExistUsername(username);
    if (existingAccount) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);
    const defaultRole = await this.roleService.getDefaultRole();

    const entity = new AccountEntity();
    entity.username = username;
    entity.password = hashedPassword;
    entity.roleId = roleId ?? defaultRole.id;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;

    const newAccount = await this.accountRepository.save(entity);

    if (!reqAccountId) {
      await this.accountRepository.update(newAccount.id, {
        createdBy: newAccount.id,
      });
    }

    return await this.getAccountByUsername(newAccount.username);
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
