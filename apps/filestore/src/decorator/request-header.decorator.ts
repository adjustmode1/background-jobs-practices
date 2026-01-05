import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (targetDto: any, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    const dto = plainToInstance(targetDto, req.headers, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException({
        error: 'HEADER_VALIDATION_ERROR',
        message: errors.flatMap((e) => Object.values(e.constraints ?? {})),
      });
    }

    return dto;
  },
);
