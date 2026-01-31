import { Injectable } from '@nestjs/common';

@Injectable()
export class FilestoreWorkerService {
  getHello(): string {
    return 'Hello World!';
  }
}
