import { ApiProperty } from '@nestjs/swagger';

export class BaseRo<T> {
  @ApiProperty()
  data?: T;

  @ApiProperty()
  message?: Array<string> | string;

  @ApiProperty()
  error?: string;
}
