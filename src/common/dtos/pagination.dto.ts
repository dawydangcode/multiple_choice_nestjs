import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';
import { DEFAULT_PAGINATION, LIMIT_ITEMS_PER_PAGE } from '../utils/constant';

export class PaginationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  page!: number;

  @ApiProperty()
  @IsString()
  search?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = LIMIT_ITEMS_PER_PAGE;

  @ApiProperty()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
