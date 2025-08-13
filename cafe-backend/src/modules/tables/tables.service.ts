import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { TableDto, TTableStatus, VisitorPayload } from './dto/table.dto';
import { RedisService } from 'src/modules/redis/redis.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class TablesService implements OnModuleInit {
  private readonly logger = new Logger(TablesService.name);
  private mockTables: TableDto[] = [
    { id: 1, name: 'Table 1', capacity: 4, status: 'AVAILABLE' },
    { id: 2, name: 'Table 2', capacity: 2, status: 'AVAILABLE' },
    { id: 3, name: 'Table 3', capacity: 4, status: 'AVAILABLE' },
    { id: 4, name: 'Table 4', capacity: 4, status: 'AVAILABLE' },
    { id: 5, name: 'Table 5', capacity: 6, status: 'AVAILABLE' },
    { id: 6, name: 'Table 6', capacity: 2, status: 'AVAILABLE' },
    { id: 7, name: 'Table 7', capacity: 4, status: 'AVAILABLE' },
    { id: 8, name: 'Table 8', capacity: 2, status: 'AVAILABLE' },
    { id: 9, name: 'Table 9', capacity: 4, status: 'AVAILABLE' },
    { id: 10, name: 'Table 10', capacity: 6, status: 'AVAILABLE' },
    { id: 11, name: 'Table 11', capacity: 4, status: 'AVAILABLE' },
    { id: 12, name: 'Table 12', capacity: 2, status: 'AVAILABLE' },
  ];

  constructor(
    private readonly redisService: RedisService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  onModuleInit() {
    this.redisService.initializeTables(this.mockTables);
  }

  async getAllTables(): Promise<TableDto[]> {
    try {
      const tables = await this.redisService.getAllTables();
      return tables.sort((a, b) => a.id - b.id);
    } catch (error) {
      this.logger.error('Error getting all tables:', error);
      // В случае ошибки возвращаем моковые данные
      return this.mockTables;
    }
  }

  async getTableById(tableId: number): Promise<TableDto | null> {
    try {
      const table = await this.redisService.getTable(tableId.toString());
      return table;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error getting table ${tableId}:`, error);
      throw new Error(`Failed to get table ${tableId}`);
    }
  }

  async updateTable(
    tableId: number,
    status: TTableStatus,
    visitorData?: VisitorPayload,
  ): Promise<TableDto> {
    try {
      const table = await this.getTableById(tableId);
      if (!table) throw new BadRequestException('Table not found');
      const updatedTable: TableDto = {
        ...table,
        status,
        visitorData,
      };
      await this.redisService.saveTable(updatedTable);
      return updatedTable;
    } catch (error) {
      this.logger.error(`Error updating table ${tableId} status:`, error);
      throw error;
    }
  }

  async createReservation(
    tableId: number,
    visitorData: VisitorPayload,
  ) {
    return this.updateTable(tableId, 'RESERVED', visitorData);
  }

  async quickSeatTable(tableId: number, guests: number): Promise<TableDto> {
    const visitorId = crypto.randomUUID();
    const table = await this.updateTable(tableId, 'OCCUPIED', { guests, visitorId });
    // Записываем вход посетителя в аналитику
    try {
      this.logger.debug({visitorId})
      const guestCount = guests || table.visitorData?.guests || table.capacity;
      await this.analyticsService.recordVisitorEntry(tableId, visitorId, guestCount);
    } catch (error) {
      this.logger.error(
        `Failed to record visitor entry for table ${tableId}:`,
        error,
      );
    }

    return table;
  }

  async freeTable(tableId: number): Promise<TableDto> {
    const table = await this.getTableById(tableId);
    if (!table) throw new BadRequestException('Table not found');
    this.logger.debug({table})
    const updatedTable = await this.updateTable(tableId, 'AVAILABLE');
    // Записываем выход посетителя в аналитику
    try {
      if (table.visitorData && table.visitorData.visitorId) {
        await this.analyticsService.recordVisitorExit(tableId, table.visitorData.visitorId);
      }
    } catch (error) {
      this.logger.error(
        `Failed to record visitor exit for table ${tableId}:`,
        error,
      );
    }

    return updatedTable;
  }
}
