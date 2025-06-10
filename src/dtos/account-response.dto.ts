import { IsString, IsNumber, IsNotEmpty, isNotEmpty } from 'class-validator';

export class AccountResponseDto {
  id: number;
  username: string;
  password: string;
  roleId: number;

  constructor(partial: Partial<AccountResponseDto>) {
    Object.assign(this, partial);
  }
}
