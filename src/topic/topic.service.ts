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

  async createTopic(
    name: string,
    description: string,
    reqAccountId: number,
  ): Promise<TopicModel> {
    const entity = new TopicEntity();
    entity.name = name;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;

    const newTopic = await this.topicRepository.save(entity);

    return newTopic.toModel();
  }

  async updateTopic(
    topic: TopicModel,
    name: string | undefined,
    description: string | undefined,
    reqAccountId: number | undefined,
  ): Promise<TopicModel> {
    await this.topicRepository.update(
      { id: topic.id, deletedAt: IsNull() },
      {
        name: name,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );

    return await this.getTopicById(topic.id);
  }

  async deleteTopic(topic: TopicModel, reqAccountId: number): Promise<boolean> {
    await this.topicRepository.update(
      { id: topic.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );

    return true;
  }
}
