import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class EmployeeDto{
    @ApiProperty()
    @Type(()=> Number)
    id!: number;

    @ApiProperty()
    @Type(() => Number)
    accountId!: number;
}