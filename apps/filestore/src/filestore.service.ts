import { Injectable } from '@nestjs/common';

@Injectable()
export class FilestoreService {
  getHello(): string {
    return 'Hello World!';
  }
}
