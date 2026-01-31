import { ApiProperty } from '@nestjs/swagger';
import { ChunkRo } from './chunk.ro';

export class InitUploadRo {
  @ApiProperty()
  data: Array<ChunkRo>;

  @ApiProperty()
  chunkSize: number;

  @ApiProperty()
  fileId: string;

  @ApiProperty()
  nextStep: string;
}
