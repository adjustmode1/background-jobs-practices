import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { FilestoreService } from './filestore.service';
import { InitUploadDto } from './dto/init-upload.dto';
import { UserHeaderDto } from './dto/user-header.dto';
import { InitUploadRo } from './ro/init-upload.ro';
import { BaseRo } from './ro/base.ro';
import { RequestHeader } from './decorator/request-header.decorator';
import { CompleteUploadDto } from './dto/complete-upload.dto';
import { ListPartsDto } from './dto/list-parts.dto';

@Controller('upload')
export class FilestoreController {
  private readonly logger = new Logger(FilestoreController.name);
  constructor(private readonly filestoreService: FilestoreService) {}

  @Post('init')
  async initUpload(
    @RequestHeader(UserHeaderDto) headers: UserHeaderDto,
    @Body() data: InitUploadDto,
  ): Promise<BaseRo<InitUploadRo>> {
    this.logger.verbose('.initUpload');
    const result = await this.filestoreService.initUpload(
      headers['x-user-id'],
      data.fileSize,
      data.name,
    );

    return {
      data: result,
      message: 'Init completed',
    };
  }

  // Complete multipart upload upload
  @Post('complete')
  async completeUpload(
    @RequestHeader(UserHeaderDto) headers: UserHeaderDto,
    @Body() data: CompleteUploadDto,
  ): Promise<BaseRo<InitUploadRo>> {
    const result = await this.filestoreService.completeUpload(data.fileId);

    return {
      message: 'Upload completed',
    };
  }

  // Resume multipart upload

  // List uploaded
  @Get('list-parts/:fileId')
  async listParts(
    @RequestHeader(UserHeaderDto) headers: UserHeaderDto,
    @Param() params: ListPartsDto,
  ): Promise<BaseRo<InitUploadRo>> {
    this.logger.verbose('.listParts', { fileId: params.fileId });

    const result = await this.filestoreService.listParts(params.fileId);

    return {
      // data: result,
      message: 'Init completed',
    };
  }
}
