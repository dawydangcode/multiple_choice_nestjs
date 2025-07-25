import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class ExamDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  examId!: number;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  minuteDuration!: number;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @Type(() => Boolean)
  isActive!: boolean;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  page!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  limit!: number;

  @ApiProperty()
  @IsString()
  q!: string;
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

export class GetExamsQueryDto extends PartialType(
  PickType(ExamDto, ['page', 'limit', 'q']),
) {}
