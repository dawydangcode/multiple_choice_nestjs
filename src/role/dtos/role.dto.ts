import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateRoleBodyDto extends PickType(RoleDto, ['name']) {}
