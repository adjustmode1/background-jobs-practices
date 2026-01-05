import { ApiProperty } from '@nestjs/swagger';

export class InitUploadRo {
  @ApiProperty()
  data: Array<string>;

  @ApiProperty()
  nextStep: string;
}
