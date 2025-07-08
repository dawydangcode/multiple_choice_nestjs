export class ExamModel {
  public readonly id: number;
  public readonly title: string;
  public readonly minuteDuration: number;
  public readonly isActive: boolean;
  public readonly description: string | undefined;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;

  constructor(
    id: number,
    title: string,
    minuteDuration: number,
    isActive: boolean,
    description: string | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.title = title;
    this.minuteDuration = minuteDuration;
    this.isActive = isActive;
    this.description = description;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
  public readonly deletedBy: number | undefined;
}
