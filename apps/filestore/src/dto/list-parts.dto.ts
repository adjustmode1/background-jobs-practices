import { IsNotEmpty, IsString } from 'class-validator';

export class ListPartsDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;
}
