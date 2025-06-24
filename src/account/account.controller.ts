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

import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/decorator/roles.decorator';
import { Role } from 'src/role/enum/role.enum';

@ApiTags('Account')
@Controller('api/v1')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Roles(Role.Admin)
  @Get('account/list')
  async getAllAccount(): Promise<AccountModel[]> {
    return await this.accountService.getAccounts();
  }

  @Roles(Role.Admin)
  @Get('account/:accountId/detail')
  async getAccountById(
    @Param() params: GetAccountParamsDto,
  ): Promise<AccountModel> {
    return await this.accountService.getAccount(params.accountId);
  }

  @Roles(Role.Admin)
  @Post('account/create')
  async createAccount(@Body() body: CreateAccountBodyDto) {
    return await this.accountService.createAccount(
      body.username,
      body.password,
      body.roleId,
      undefined,
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
      undefined,
    );
  }

  @Delete('account/:accountId/delete')
  async deleteAccount(@Param() params: any) {
    const account = await this.accountService.getAccount(params.accountId);
    return await this.accountService.deleteAccount(account);
  }
}
