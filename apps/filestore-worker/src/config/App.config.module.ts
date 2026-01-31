import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './App.config.service';

@Global()
@Module({
  imports: [],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
