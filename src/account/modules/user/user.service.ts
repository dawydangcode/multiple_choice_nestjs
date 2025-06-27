import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { IsNull, Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { AccountDetailService } from '../account-detail/account-detail.service';
import { AccountModel } from 'src/account/models/account.model';
import { UserModel } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private readonly accountDetailService: AccountDetailService,
  ) {}

  async getProfile(accountId: number): Promise<UserModel> {
    const accountDetail =
      await this.accountDetailService.getAccountDetailByAccountId(accountId);

    const user = await this.userEntity.findOne({
      where: {
        accountId: accountDetail.id,
        deletedAt: IsNull(),
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.toModel();
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
}
