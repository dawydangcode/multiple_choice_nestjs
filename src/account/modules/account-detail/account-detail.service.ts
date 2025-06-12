import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AccountDetailEntity } from './entities/account-detail.entity';
import { AccountDetailModel } from './models/account-detail.model';
import { GenderType } from './enums/gender.type';

@Injectable()
export class AccountDetailService {
  constructor(
    @InjectRepository(AccountDetailEntity)
    private readonly accountDetailRepository: Repository<AccountDetailEntity>,
  ) {}

  async getAccountDetails(): Promise<AccountDetailModel[]> {
    const accountDetails = this.accountDetailRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
    return (await accountDetails).map((accountDetail: AccountDetailEntity) =>
      accountDetail.toModel(),
    );
  }

  async checkAccountDetailExists(accountId: number): Promise<boolean> {
    const accountDetail = await this.accountDetailRepository.findOne({
      where: { id: accountId, deletedAt: IsNull() },
    });
    return !!accountDetail;
  }

  async getAccountDetail(accountDetailId: number): Promise<AccountDetailModel> {
    const accountDetail = await this.accountDetailRepository.findOne({
      where: { id: accountDetailId, deletedAt: IsNull() },
    });
    if (!accountDetail) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
    return accountDetail.toModel();
  }

  async getAccountDetailByAccountId(
    accountId: number,
  ): Promise<AccountDetailModel> {
    const accountDetail = await this.accountDetailRepository.findOne({
      where: {
        accountId: accountId,
        deletedAt: IsNull(),
      },
    });

    if (!accountDetail) {
      throw new HttpException(
        'Account detail not found :D',
        HttpStatus.NOT_FOUND,
      );
    }

    return accountDetail.toModel();
  }

  async createAccountDetail(
    accountId: number,
    name: string,
    dob: string,
    gender: GenderType,
    imageUrl: string,
  ): Promise<AccountDetailModel> {
    const entity = new AccountDetailEntity();
    entity.accountId = accountId;
    entity.name = name;
    entity.dob = dob;
    entity.gender = gender;
    entity.imageUrl = imageUrl;
    entity.createdAt = new Date();
    entity.createdBy = accountId;
    const newAccountDetail = await this.accountDetailRepository.save(entity);
    return await this.getAccountDetail(newAccountDetail.id);
  }

  async updateAccountDetail(
    accountDetail: AccountDetailModel,
    name: string | undefined,
    dob: string | undefined,
    gender: GenderType | undefined,
    imageUrl: string | undefined,
    accountId: number | undefined,
  ): Promise<AccountDetailModel> {
    await this.accountDetailRepository.update(
      {
        id: accountDetail.id,
        deletedAt: IsNull(),
      },
      {
        name: name,
        dob: dob,
        gender: gender,
        imageUrl: imageUrl,
        accountId: accountId,
        updatedBy: accountId,
        updatedAt: new Date(),
      },
    );
    return this.getAccountDetail(accountDetail.id);
  }

  async deleteAccountDetail(
    accountDetail: AccountDetailModel,
    accountId: number,
  ): Promise<boolean> {
    await this.accountDetailRepository.update(
      {
        id: accountDetail.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: accountId,
      },
    );
    return true;
  }
}
