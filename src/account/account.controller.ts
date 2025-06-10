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
import { CreateAccountBodyDto } from './dtos/account.dto';

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('all')
  async getAllAccount() {
    return this.accountService.findAll();
  }

  @Get(':accountId')
  async getAccountById(@Param() params: any) {
    return this.accountService.findById(params.accountId);
  }

  @Post('create')
  async createAccount(@Body() body: CreateAccountBodyDto) {
    return this.accountService.create(body.username, body.password, 1, 1);
  }

  // @Put(':accountId/update')
  // async updateAccount(@Param() params: any, @Body() body: any) {
  //   return this.accountService.update(params.accountId, account);
  // }

  @Put(':accountId/update')
  async updateAccount(@Param() params: any, @Body() body: any) {
    await this.accountService.update(
      {
        id: params.accountId,
        username: body.username,
        password: body.password,
        roleId: 1,
      },
      body.username,
      body.password,
      1,
      1,
    );
    return this.accountService.findById(params.accountId);
  }

  @Delete(':accountId/delete')
  async deleteAccount() {}
}
