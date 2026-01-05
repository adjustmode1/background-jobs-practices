import { IsNotEmpty, IsString } from 'class-validator';

export class ListPartsDto {
  @IsString()
  @IsNotEmpty()
  uploadId: string;
}
