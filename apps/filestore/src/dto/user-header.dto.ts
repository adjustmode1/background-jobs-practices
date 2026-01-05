import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UserHeaderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  'x-user-id': string;
}
