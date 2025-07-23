import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Post,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AccountDetailService } from './account-detail.service';
import { AccountDetailModel } from './models/account-detail.model';
import {
  CreateAccountDetailBodyDto,
  GetAccountDetailByAccountIdParamsDto,
  GetAccountDetailParamsDto,
  GetAccountDetailsQueryDto,
  UpdateAccountDetailParamsDto,
} from './dtos/account-detail.dto';
import { ApiTags } from '@nestjs/swagger';
import { ADMIN_ACCOUNT_ID } from 'src/common/utils/constant';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@ApiTags('Account / Account Detail')
@Controller('/api/v1/')
export class AccountDetailController {
  constructor(private readonly accountDetailService: AccountDetailService) {}

  @Get('account-detail/list')
  async getAccountDetails(@Query() query: GetAccountDetailsQueryDto) {
    return await this.accountDetailService.getAccountDetails(
      undefined,
      undefined,
      new PaginationParamsModel(),
      undefined,
      undefined,
    );
  }

  @Get('account-detail/:accountDetailId/detail')
  async getAccountDetail(
    @Param() params: GetAccountDetailParamsDto,
  ): Promise<AccountDetailModel> {
    return await this.accountDetailService.getAccountDetail(
      params.accountDetailId,
    );
  }

  @Post('account-detail/create')
  async createAccountDetail(@Body() body: CreateAccountDetailBodyDto) {
    return await this.accountDetailService.createAccountDetail(
      body.accountId,
      body.name,
      body.dob,
      body.gender,
      body.imageUrl,
      ADMIN_ACCOUNT_ID,
    );
  }

  @Put('account-detail/:accountDetailId/update')
  async updateAccountDetail(
    @Param() params: UpdateAccountDetailParamsDto,
    @Body() body: any,
  ): Promise<AccountDetailModel> {
    const accountDetail = await this.accountDetailService.getAccountDetail(
      params.accountDetailId,
    );

    return await this.accountDetailService.updateAccountDetail(
      accountDetail,
      body.name,
      body.dob,
      body.gender,
      body.imageUrl,
      body.accountId,
      ADMIN_ACCOUNT_ID,
    );
  }

  @Delete('account-detail/:accountDetailId/delete')
  async deleteAccountDetail(@Param() params: any) {
    const accountDetail = await this.accountDetailService.getAccountDetail(
      params.accountDetailId,
    );
    return await this.accountDetailService.deleteAccountDetail(
      accountDetail,
      accountDetail.accountId,
    );
  }

  @Get('account/:accountId/account-detail')
  async getAccountDetailByAccountId(
    @Param() params: GetAccountDetailByAccountIdParamsDto,
  ): Promise<AccountDetailModel> {
    return await this.accountDetailService.getAccountDetailByAccountId(
      params.accountId,
    );
  }
}
