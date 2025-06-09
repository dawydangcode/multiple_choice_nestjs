import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
    constructor(
        private readonly accountService: AccountService
    ){}

    @Get('/all')
    getAllAccount() {
        return this.accountService.findAll();
    }

    @Post('/create')
    createAccount(@Body() account: any) {
        return this.accountService.create(account);
    }

    @Put('/update/:id')
    updateAccount(@Param('id') id: string, @Body() account: any) {
        return this.accountService.update(id, account);
    }
}
