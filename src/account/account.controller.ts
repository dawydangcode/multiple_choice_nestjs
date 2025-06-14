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
import { AccountDetailService } from './modules/account-detail/account-detail.service';
import { AccountDetailModule } from './modules/account-detail/account-detail.module';
import {
  GetAccountDetailByAccountIdParamsDto,
  GetAccountDetailParamsDto,
} from './modules/account-detail/dtos/account-detail.dto';
import { AccountModule } from './account.module';
import { AccountDetailModel } from './modules/account-detail/models/account-detail.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Account')
@Controller('api/v1')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('account/list')
  async getAllAccount(): Promise<AccountModel[]> {
    return await this.accountService.getAccounts();
  }

  @Get('account/:accountId/detail')
  async getAccountById(
    @Param() params: GetAccountParamsDto,
  ): Promise<AccountModel> {
    return await this.accountService.getAccount(params.accountId);
  }

  @Post('account/create')
  async createAccount(@Body() body: CreateAccountBodyDto) {
    return await this.accountService.createAccount(
      body.username,
      body.password,
      body.roleId,
      1,
    );
  }

  @Put('account/:accountId/update')
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

  @Delete('account/:accountId/delete')
  async deleteAccount(@Param() params: any) {
    const account = await this.accountService.getAccount(params.accountId);
    return await this.accountService.deleteAccount(account);
  }
}
