import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { In, IsNull, Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { AccountDetailService } from '../account-detail/account-detail.service';
import { AccountModel } from 'src/account/models/account.model';
import { UserModel } from './model/user.model';
import { AccountDetailModel } from '../account-detail/models/account-detail.model';
import { GenderType } from '../account-detail/enums/gender.type';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly accountDetailService: AccountDetailService,
  ) {}

  async getUsers(
    userIds: number[],
    pagination: PaginationParamsModel | undefined,
  ): Promise<PageList<UserModel>> {
    // TO DO
    const [users, total] = await this.userRepository.findAndCount({
      where: { id: userIds ? In(userIds) : undefined, deletedAt: IsNull() },
      ...pagination?.toQuery(),
    });

    return new PageList<UserModel>(
      total,
      users.map((user: UserEntity) => user.toModel()),
    );
  }

  async getUserById(userId: number): Promise<UserModel> {
    return this.userRepository
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

    const newUser = await this.userRepository.save(entity);
    return newUser.toModel();
  }

  async uploadCV(account: AccountModel, cvUrl: string): Promise<UserModel> {
    const entity = new UserEntity();
    entity.accountId = account.id;
    entity.createdAt = new Date();
    entity.createdBy = account.id;
    entity.cvUrl = cvUrl;

    const newUser = await this.userRepository.save(entity);
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
