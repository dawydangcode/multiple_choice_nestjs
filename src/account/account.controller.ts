import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  CreateAccountBodyDto,
  GetAccountParamsDto,
  UpdateAccountParamsDto,
} from './dtos/account.dto';
import { AccountModel } from './models/account.model';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('all')
  async getAllAccount(): Promise<AccountModel[]> {
    return await this.accountService.getAccounts();
  }

  @Get(':accountId/detail')
  async getAccountById(@Param() params: GetAccountParamsDto) {
    return await this.accountService.getAccount(params.accountId);
  }

  @Post('create')
  async createAccount(@Body() body: CreateAccountBodyDto) {
    return await this.accountService.createAccount(
      body.username,
      body.password,
      body.roleId,
      1,
    );
  }

  // @Put(':accountId/update')
  // async updateAccount(@Param() params: any, @Body() body: any) {
  //   return this.accountService.update(params.accountId, account);
  // }

  @Put(':accountId/update')
  async updateAccount(
    @Param() params: UpdateAccountParamsDto,
    @Body() body: any,
  ) {
    const account = await this.accountService.getAccount(params.accountId);
    return await this.accountService.updateAccount(
      account,
      body.username,
      body.password,
      body.roleId,
      1,
    );
  }

  @Delete(':accountId/delete')
  async deleteAccount(@Param() params: any) {
    const account = await this.accountService.getAccount(params.accountId);
    return await this.accountService.deleteAccount(account);
  }
}
