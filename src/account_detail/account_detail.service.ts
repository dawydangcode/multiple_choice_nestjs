import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountDetailEntity } from 'src/account/modules/account_detail/entities/account-detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountDetailService {
  constructor(
    @InjectRepository(AccountDetailEntity)
    private readonly accountDetaiRepository: Repository<AccountDetailEntity>,
  ) {}
}
