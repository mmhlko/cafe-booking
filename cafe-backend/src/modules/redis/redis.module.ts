import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  imports: [ConfigModule],
  exports: [RedisService],
})
export class RedisModule {}
