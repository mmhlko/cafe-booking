import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { TablesiController } from './tables.controller';
import { TablesService } from './tables.service';

@Module({
  imports: [RedisModule, AnalyticsModule],
  controllers: [TablesiController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
