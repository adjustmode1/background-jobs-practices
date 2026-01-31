import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class FilestoreWorkerController {
  private readonly logger = new Logger(FilestoreWorkerController.name);

  @EventPattern('minio.object.created')
  handleFileCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.verbose('.handleFileCreated', data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      channel.ack(msg);
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      channel.nack(msg, false, true);
    }
  }
}
