import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteUploadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  uploadId: string;
}
