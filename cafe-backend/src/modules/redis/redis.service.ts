import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { TableDto } from '../api/dto/table.dto';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.debug({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
    this.client = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });
  }

  async onModuleInit() {
    await this.ensureClient();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }

  private async ensureClient() {
    if (!this.client) {
      this.client = new Redis({
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
        password: this.configService.get<string>('REDIS_PASSWORD'),
      });

      this.client.on('error', (error: unknown) => {
        if (error instanceof Error) {
          this.logger.error('Connection Redis error:', error.message);
        } else {
          this.logger.error('Unknown Redis error:', error);
        }
      });

      this.client.on('connect', () => {
        this.logger.log('Connection Redis success');
      });

      await new Promise<void>((resolve, reject) => {
        if (this.client) {
          this.client.once('ready', resolve);
          this.client.once('error', reject);
        }
      });
    }
  }

  async getClient(): Promise<Redis> {
    await this.ensureClient();
    return this.client;
  }

    async initializeTables(mockTables: TableDto[], force: boolean = false): Promise<void> {
    try {
      await this.ensureClient();
      
      // Проверяем, есть ли уже данные в Redis
      const existingKeys = await this.client.keys('tables:*');
      
      if (existingKeys.length > 0 && !force) {
        this.logger.log('Tables already exist in Redis. Skipping initialization.');
        return;
      }
      
      // Используем pipeline для эффективной записи
      const pipeline = this.client.pipeline();
      
      mockTables.forEach(table => {
        pipeline.set(`tables:${table.id}`, JSON.stringify(table));
      });
      
      await pipeline.exec();
      this.logger.log(`Successfully initialized ${mockTables.length} tables in Redis`);
      
    } catch (error) {
      this.logger.error('Failed to initialize tables:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  async saveTable(data: TableDto): Promise<void> {
    try {
      await this.ensureClient();
      await this.client.set(`tables:${data.id}`, JSON.stringify(data))
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to saveTable for ${data.id}:`,
          error.message,
        );
      }
      throw error;
    }
  }

  async getAllTables(): Promise<TableDto[]> {
    const keys = await this.client.keys('tables:*');

    if (!keys.length) return [];

    const data = await this.client.mget(keys);
    return data.filter((x) => x !== null).map((x) => JSON.parse(x) as TableDto);
  }

  // Получаем данные по адресу пары
  async getTable(id: string): Promise<TableDto | null> {
    const data = await this.client.get(`tables:${id}`);
    if (!data) return null;
    return JSON.parse(data) as TableDto;
  }
}
