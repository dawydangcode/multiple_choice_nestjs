import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ description: 'Current page number', example: 1 })
  public readonly currentPage: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  public readonly itemsPerPage: number;

  @ApiProperty({ description: 'Total number of items', example: 25 })
  public readonly totalItems: number;

  @ApiProperty({ description: 'Total number of pages', example: 3 })
  public readonly totalPages: number;

  @ApiProperty({ description: 'Has previous page', example: false })
  public readonly hasPreviousPage: boolean;

  @ApiProperty({ description: 'Has next page', example: true })
  public readonly hasNextPage: boolean;

  constructor(currentPage: number, itemsPerPage: number, totalItems: number) {
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / itemsPerPage);
    this.hasPreviousPage = currentPage > 1;
    this.hasNextPage = currentPage < this.totalPages;
  }
}

export class PaginationResponse<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data;
    this.meta = meta;
  }
}
