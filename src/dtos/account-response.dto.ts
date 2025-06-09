import {IsString, IsNumber, IsNotEmpty, isNotEmpty} from 'class-validator';

export class AccountResponseDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    password: string;
    
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;

    @IsNumber()
    @IsNotEmpty()
    roleId: string;

    constructor(partial: Partial<AccountResponseDto>) {
        Object.assign(this, partial);
    }
}