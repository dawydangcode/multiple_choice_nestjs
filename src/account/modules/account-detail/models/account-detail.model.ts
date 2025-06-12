import { GenderType } from '../enums/gender.type';

export class AccountDetailModel {
  public readonly id: number;
  public readonly accountId: number;
  public readonly name: string;
  public readonly dob: string;
  public readonly gender: GenderType;
  public readonly imageUrl: string;
  public readonly created_at: Date;
  public readonly created_by: number;
  public readonly updated_at: Date;
  public readonly updated_by: number;
  public readonly deleted_at: Date;
  public readonly deleted_by: number;

  constructor(
    id: number,
    accountId: number,
    name: string,
    dob: string,
    gender: GenderType,
    imageUrl: string,
    created_at: Date,
    created_by: number,
    updated_at: Date,
    updated_by: number,
    deleted_at: Date,
    deleted_by: number,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.name = name;
    this.dob = dob;
    this.gender = gender;
    this.imageUrl = imageUrl;
    this.created_at = created_at;
    this.created_by = created_by;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
    this.deleted_at = deleted_at;
    this.deleted_by = deleted_by;
  }
}
