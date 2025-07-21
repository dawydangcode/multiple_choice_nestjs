import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

export class AnswerDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  questionId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  answerId!: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers!: AnswerDto[];

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  pickExamId!: number;
}

export class SubmitAnswersBodyDto extends PickType(AnswerDto, ['answers']) {}

export class GetPickExamBodyDto extends PickType(AnswerDto, ['pickExamId']) {}
