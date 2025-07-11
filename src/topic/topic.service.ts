import { Injectable } from '@nestjs/common';
import { TopicEntity } from './entities/topic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { TopicModel } from './models/topic.model';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
  ) {}

  async getTopics(): Promise<TopicModel[]> {
    const topics = await this.topicRepository.find({
      where: { deletedAt: IsNull() },
    });

    return topics.map((topic: TopicEntity) => topic.toModel());
  }

  async getTopicById(topicId: number): Promise<TopicModel> {
    const topic = await this.topicRepository.findOne({
      where: { id: topicId, deletedAt: IsNull() },
    });
    if (!topic) {
      throw new Error('Topic not found');
    }
    return topic.toModel();
  }
}
