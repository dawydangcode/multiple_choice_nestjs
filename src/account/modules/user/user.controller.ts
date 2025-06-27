import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserProfileParamDto, UploadCVBodyDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from 'src/account/account.service';

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
    const account = await this.accountService.getAccount(req.user.accountId);
    const cvUrl = body.cvUrl;
    return await this.userService.uploadCV(account, cvUrl);
  }
}
