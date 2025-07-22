import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  questionId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  answerId!: number;
}

export class SubmitAnswersBodyDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers!: SubmitAnswerDto[];
}
