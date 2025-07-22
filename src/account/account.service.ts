import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountModel } from './models/account.model';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/auth/constants/auth.const';
import { RoleService } from 'src/role/role.service';
import { RoleType } from 'src/role/enum/role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationUtil } from 'src/common/utils/pagination.util';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly roleService: RoleService,
  ) {}

  async getAccounts(
    paginationDto: PaginationDto,
  ): Promise<PageList<AccountModel>> {
    const { search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.accountRepository
      .createQueryBuilder('account')
      .where('account.deletedAt IS NULL');
    if (search) {
      queryBuilder.andWhere('account.username LIKE :search', {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy(`account.${sortBy}`, sortOrder);

    const result = await PaginationUtil.paginate(queryBuilder, paginationDto);

    const accounts = result.data.map((account: AccountEntity) =>
      account.toModel(true),
    );

    return new PageList(accounts, result.meta);
  }

  async getAccount(
    accountId: number,
    isHiddenPassword: boolean,
  ): Promise<AccountModel> {
    const account = await this.accountRepository.findOne({
      where: {
        id: accountId,
        deletedAt: IsNull(),
      },
    });

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    return account.toModel(isHiddenPassword);
  }

  async getAccountByUsername(
    username: string,
    isHiddenPassword: boolean,
  ): Promise<AccountModel> {
    const account = await this.accountRepository.findOne({
      where: {
        username: username,
        deletedAt: IsNull(),
      },
    });

    if (!account) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return account.toModel(isHiddenPassword);
  }

  async getAccountByEmail(email: string) {
    const existingEmail = this.accountRepository.findOne({
      where: {
        email: email,
        deletedAt: IsNull(),
      },
    });
    return existingEmail;
  }

  async createAccount(
    username: string,
    password: string,
    email: string,
    roleId: number,
    reqAccountId: number | undefined,
  ): Promise<AccountModel> {
    const existingUsernameAccount = await this.accountRepository.findOne({
      where: {
        username: username,
        deletedAt: IsNull(),
      },
    });

    if (existingUsernameAccount) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingEmailAccount = await this.accountRepository.findOne({
      where: {
        email: email,
        deletedAt: IsNull(),
      },
    });

    if (existingEmailAccount) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);
    const defaultRole = await this.roleService.getRoleByName(RoleType.User);

    const entity = new AccountEntity();
    entity.username = username;
    entity.password = hashedPassword;
    entity.email = email;
    entity.roleId = roleId ?? defaultRole.id;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;

    const newAccount = await this.accountRepository.save(entity);
    if (!reqAccountId) {
      await this.accountRepository.update(newAccount.id, {
        createdBy: newAccount.id,
      });
    }

    return await this.getAccount(newAccount.id, true);
  }

  async updateAccount(
    account: AccountModel,
    username: string | undefined,
    password: string | undefined,
    roleId: number | undefined,
    reqAccountId: number | undefined,
  ): Promise<AccountModel> {
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);
    }

    await this.accountRepository.update(
      {
        id: account.id,
        deletedAt: IsNull(),
      },
      {
        username: username,
        password: hashedPassword,
        roleId: roleId,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );

    return await this.getAccount(account.id, true);
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

  async getAccountRole(accountId: number): Promise<AccountModel> {
    const account = await this.getAccount(accountId, true);
    const role = await this.roleService.getRole(account.roleId);
    return {
      ...account,
      roleId: role.id,
    };
  }
}
