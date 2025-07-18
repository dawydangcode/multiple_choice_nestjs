import { Controller } from '@nestjs/common';
import { PickExamService } from './pick-exam.service';

@Controller('api/v1/pick-exam')
export class PickExamController {
  constructor(private readonly pickExamService: PickExamService) {}
    

}
