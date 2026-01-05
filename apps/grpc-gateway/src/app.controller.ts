import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class HelloController {
  @GrpcMethod('HelloService', 'GetHello')
  getHello() {
    return { message: 'Hello from gRPC service 🚀' };
  }
}
