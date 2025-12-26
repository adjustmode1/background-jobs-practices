import { Controller, Get } from '@nestjs/common';
import { FilestoreService } from './filestore.service';

@Controller()
export class FilestoreController {
  constructor(private readonly filestoreService: FilestoreService) {}

  @Get()
  getHello(): string {
    return this.filestoreService.getHello();
  }
}
