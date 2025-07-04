import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import {
  GetUserProfileParamDto,
  UpdateProfileBodyDto,
  UpdateProfileParamsDto,
  UploadCVBodyDto,
} from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from 'src/account/account.service';
import { UpdateAccountBodyDto } from 'src/account/dto/account.dto';

@Controller('api/v1/user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  @Get('profile')
  async getProfile(@Req() req: any, @Param() params: GetUserProfileParamDto) {
    const profile = await this.userService.getProfile(req.user.accountId);
    return profile;
  }

  @Post('upload-cv')
  async uploadCV(@Req() req: any, @Body() body: UploadCVBodyDto) {
    const account = await this.accountService.getAccount(
      req.user.accountId,
      true,
    );
    const cvUrl = body.cvUrl;
    return await this.userService.uploadCV(account, cvUrl);
  }

  @Put('profile/update/')
  async updateProfile(
    @Req() req: any,
    @Body() body: any,
    @Param() params: UpdateProfileParamsDto,
  ) {
    const account = await this.accountService.getAccount(
      req.user.accountId,
      true,
    );
    return await this.userService.updateProfile(
      account,
      body.name,
      body.dob,
      body.gender,
      body.imageUrl,
      params.accountId,
    );
  }
}
