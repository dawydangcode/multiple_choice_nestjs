import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '../dtos/pagination.dto';
import {
  PaginationMeta,
  PaginationResponse,
} from '../models/pagination-response.model';

export class PaginationUtil {
  static async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<T>> {
    const { page = 1, limit = 10 } = paginationDto;

    // Calculate offset
    const offset = (page - 1) * limit;

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    // Get data and count
    const [data, totalItems] = await queryBuilder.getManyAndCount();

    // Create meta
    const meta = new PaginationMeta(page, limit, totalItems);

    return new PaginationResponse(data, meta);
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
