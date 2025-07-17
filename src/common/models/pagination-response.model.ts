import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  public readonly currentPage: number;
  public readonly itemsPerPage: number;
  public readonly totalItems: number;
  public readonly totalPages: number;
  public readonly hasPreviousPage: boolean;
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
  @ApiProperty({ description: 'Danh sách data' })
  data: T[];

  @ApiProperty({ description: 'Thông tin pagination', type: PaginationMeta })
  meta: PaginationMeta;

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data;
    this.meta = meta;
  }
}
