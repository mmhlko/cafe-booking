import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [RedisModule],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
