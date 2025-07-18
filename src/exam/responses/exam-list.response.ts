import { ApiProperty } from '@nestjs/swagger';
import { ExamModel } from '../models/exam.model';
import { PaginationMeta } from 'src/common/models/pagination-response.model';

export class ExamListResponse {
  @ApiProperty({
    description: 'List of exams',
    type: [ExamModel],
    example: [
      {
        id: 1,
        title: 'Math Test',
        minuteDuration: 60,
        isActive: true,
        description: 'Basic math exam',
        createdAt: '2023-01-01T00:00:00.000Z',
        createdBy: 1,
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
      },
    ],
  })
  data!: ExamModel[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMeta,
    example: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 25,
      totalPages: 3,
      hasPreviousPage: false,
      hasNextPage: true,
    },
  })
  meta!: PaginationMeta;
}
