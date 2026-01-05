import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class InitUploadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  fileSize: number;
}
