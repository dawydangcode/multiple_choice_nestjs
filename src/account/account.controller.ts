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
} from './dto/account.dto';
import { AccountModel } from './models/account.model';

import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Account')
@Controller('api/v1')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Roles(RoleType.Admin)
  @Get('account/list')
  async getAccounts(@Body() paginationDto: PaginationDto) {
    return await this.accountService.getAccounts(paginationDto);
  }

  @Roles(RoleType.Admin)
  @Get('account/:accountId/detail')
  async getAccountById(
    @Param() params: GetAccountParamsDto,
  ): Promise<AccountModel> {
    return await this.accountService.getAccount(params.accountId, true);
  }

  @Roles(RoleType.Admin)
  @Post('account/create')
  async createAccount(@Body() body: CreateAccountBodyDto) {
    return await this.accountService.createAccount(
      body.username,
      body.password,
      body.email,
      body.roleId,
      undefined,
    );
  }

  @Put('account/:accountId/update')
  async updateAccount(
    @Param() params: UpdateAccountParamsDto,
    @Body() body: any,
  ) {
    const account = await this.accountService.getAccount(
      params.accountId,
      false,
    );
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
    const account = await this.accountService.getAccount(
      params.accountId,
      true,
    );
    return await this.accountService.deleteAccount(account);
  }
}
