import { Type } from 'class-transformer';

class Obj {}

export class ControllerResponseMetadata {
  readonly count?: number;
  readonly cursor?: string;
  readonly message!: string;
  readonly totalCount?: number;
}

export class ControllerResponse<T> {
  @Type(() => Obj)
  readonly data!: T;
  readonly metadata!: ControllerResponseMetadata;
}

export class LoginResponse {
  ant!: string;
  name!: string;
}
