import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class ExamDto {
  @ApiProperty()
  examId!: number;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @Type(() => Number)
  minuteDuration!: number;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @Type(() => Boolean)
  isActive!: boolean;
}

export class GetExamDto extends PickType(ExamDto, ['examId']) {}

export class CreateExamBodyDto extends PickType(ExamDto, [
  'title',
  'minuteDuration',
  'description',
  'isActive',
]) {}

export class UpdateExamBodyDto extends PartialType(
  PickType(ExamDto, ['title', 'minuteDuration', 'description', 'isActive']),
) {}
