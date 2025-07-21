import { ApiProperty } from '@nestjs/swagger';
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
}

export class SubmitAnswersDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers!: AnswerDto[];
}

export class SaveAnswersDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers!: AnswerDto[];
}
