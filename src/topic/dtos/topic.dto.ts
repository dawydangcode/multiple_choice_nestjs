import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class TopicDto {
  @ApiProperty()
  @Type(() => Number)
  topicId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;
}

export class GetTopicParamsDto extends PickType(TopicDto, ['topicId']) {}

export class CreateTopicBodyDto extends PickType(TopicDto, [
  'name',
  'description',
]) {}

export class UpdateTopicBodyDto extends PartialType(
  PickType(TopicDto, ['name', 'description']),
) {}
