import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import {
  CreateTopicBodyDto,
  GetTopicParamsDto,
  UpdateTopicBodyDto,
} from './dtos/topic.dto';
import { RequestModel } from 'src/utils/models/request.model';

@Controller('api/v1/')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get('topic/list')
  async getTopics() {
    return await this.topicService.getTopics();
  }

  @Get('topic/:topicId/detail')
  async getTopicById(@Param() params: GetTopicParamsDto) {
    return await this.topicService.getTopicById(params.topicId);
  }

  @Post('topic/create')
  async createTopic(
    @Req() req: RequestModel,
    @Body() body: CreateTopicBodyDto,
  ) {
    return await this.topicService.createTopic(
      body.name,
      body.description,
      req.user.accountId,
    );
  }

  @Put('topic/:topicId/update')
  async updateTopic(
    @Req() req: RequestModel,
    @Param() params: GetTopicParamsDto,
    @Body() body: UpdateTopicBodyDto,
  ) {
    const topic = await this.topicService.getTopicById(params.topicId);
    return await this.topicService.updateTopic(
      topic,
      body.name,
      body.description,
      req.user.accountId,
    );
  }

  @Delete('topic/:topicId/delete')
  async deleteTopic(
    @Req() req: RequestModel,
    @Param() params: GetTopicParamsDto,
  ) {
    const topic = await this.topicService.getTopicById(params.topicId);
    return await this.topicService.deleteTopic(topic, req.user.accountId);
  }
}
