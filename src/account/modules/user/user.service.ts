import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { IsNull, Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { AccountDetailService } from '../account-detail/account-detail.service';
import { AccountModel } from 'src/account/models/account.model';
import { UserModel } from './model/user.model';
import { AccountDetailModel } from '../account-detail/models/account-detail.model';
import { GenderType } from '../account-detail/enums/gender.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private readonly accountDetailService: AccountDetailService,
  ) {}

  async getUserById(userId: number): Promise<UserModel> {
    return this.userEntity
      .findOne({
        where: {
          id: userId,
          deletedAt: IsNull(),
        },
      })
      .then((user) => {
        if (!user) {
          throw new Error('User not found');
        }
        return user.toModel();
      });
  }

  async getProfile(
    account: AccountModel,
  ): Promise<{ user: UserModel; accountDetail: AccountDetailModel }> {
    const user = await this.getUserById(account.id);
    const accountDetail =
      await this.accountDetailService.getAccountDetailByAccountId(account.id);
    return {
      user: user,
      accountDetail: accountDetail,
    };
  }

  async createUser(account: AccountModel): Promise<UserModel> {
    const entity = new UserEntity();
    entity.accountId = account.id;
    entity.createdAt = new Date();
    entity.createdBy = account.id;
    entity.cvUrl = undefined;

    const newUser = await this.userEntity.save(entity);
    return newUser.toModel();
  }

  async uploadCV(account: AccountModel, cvUrl: string): Promise<UserModel> {
    const entity = new UserEntity();
    entity.accountId = account.id;
    entity.createdAt = new Date();
    entity.createdBy = account.id;
    entity.cvUrl = cvUrl;

    const newUser = await this.userEntity.save(entity);
    return newUser.toModel();
  }

  async updateProfile(
    account: AccountModel,
    name: string | undefined,
    dob: Date | undefined,
    gender: GenderType | undefined,
    imageUrl: string | undefined,
    reqAccountId: number,
  ): Promise<AccountDetailModel> {
    const accountDetail =
      await this.accountDetailService.getAccountDetailByAccountId(account.id);

    const updateUserProfile =
      await this.accountDetailService.updateAccountDetail(
        accountDetail,
        name,
        dob,
        gender,
        imageUrl,
        account.id,
        reqAccountId,
      );
    return updateUserProfile;
  }
}
