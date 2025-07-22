import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '../dtos/pagination.dto';
import { PaginationMeta, PageList } from '../models/page-list.model';

export class PaginationUtil {
  static async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): Promise<PageList<T>> {
    const { page = 1, limit = 10 } = paginationDto;

    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    const [data, totalItems] = await queryBuilder.getManyAndCount();

    const meta = new PaginationMeta(page, limit, totalItems);

    return new PageList(data, meta);
  }

  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static createMeta(
    page: number,
    limit: number,
    totalItems: number,
  ): PaginationMeta {
    return new PaginationMeta(page, limit, totalItems);
  }
}
