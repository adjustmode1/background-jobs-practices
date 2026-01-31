import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '../config/App.config.service';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private readonly appConfigService: AppConfigService) {
    this.client = new Redis({
      host: appConfigService.redisSetting().host,
      port: appConfigService.redisSetting().port,
    });
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string | number) {
    await this.client.set(key, value);
  }
}
