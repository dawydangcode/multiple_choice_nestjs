import { PayloadModel } from 'src/auth/model/payload.model';

export class RequestModel extends Request {
  public readonly user!: PayloadModel;
}
