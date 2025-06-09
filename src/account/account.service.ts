import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>
    ){}

    findAll(): Promise<Account[]>{
        return this.accountRepository.find();
    }

    create(account: Account): Promise<Account> {
        account.createdAt = new Date();
        account.updatedAt = new Date();
        return this.accountRepository.save(account);
    }

    async update(id: string, account: Account): Promise<Account>{
        const existingAccount = await this.accountRepository.findOneBy({ id  });
        if(!existingAccount) {
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
