import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ReservationPayload, TableDto, TTableStatus } from './dto/table.dto';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class ApiService implements OnModuleInit {
  private readonly logger = new Logger(ApiService.name);
  private mockTables: TableDto[] = [
    { id: 1, name: "Стол 1", capacity: 4, status: "AVAILABLE" },
    { id: 2, name: "Стол 2", capacity: 2, status: "AVAILABLE" },
    { id: 3, name: "Стол 3", capacity: 4, status: "AVAILABLE" },
    { id: 4, name: "Стол 4", capacity: 4, status: "AVAILABLE" },
    { id: 5, name: "Стол 5", capacity: 6, status: "AVAILABLE" },
    { id: 6, name: "Стол 6", capacity: 2, status: "AVAILABLE" },
    { id: 7, name: "Стол 7", capacity: 4, status: "AVAILABLE" },
    { id: 8, name: "Стол 8", capacity: 2, status: "AVAILABLE" },
    { id: 9, name: "Стол 9", capacity: 4, status: "AVAILABLE" },
    { id: 10, name: "Стол 10", capacity: 6, status: "AVAILABLE" },
    { id: 11, name: "Стол 11", capacity: 4, status: "AVAILABLE" },
    { id: 12, name: "Стол 12", capacity: 2, status: "AVAILABLE" },
  ];

  constructor(private readonly redisService: RedisService) {}

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

  async updateTable(tableId: number, status: TTableStatus, reservationData?: ReservationPayload): Promise<TableDto> {
    try {
      const table = await this.getTableById(tableId);
      if (!table) throw new BadRequestException('Table not found');
      const updatedTable: TableDto = {
        ...table,
        status,
        reservation: reservationData,
      };
      await this.redisService.saveTable(updatedTable);
      return updatedTable;
    } catch (error) {
      this.logger.error(`Error updating table ${tableId} status:`, error);
      throw error;
    }
  }

  async createReservation(tableId: number, reservationPayload: ReservationPayload) {
    return this.updateTable(
      tableId,
      'RESERVED',
      reservationPayload,
    );
  }

  async quickSeatTable(tableId: number): Promise<TableDto> {
    return this.updateTable(tableId, 'OCCUPIED');
  }

  async freeTable(tableId: number): Promise<TableDto> {
    return this.updateTable(tableId, 'AVAILABLE');
  }

  async getTablesStats(): Promise<{
    available: number;
    occupied: number;
    reserved: number;
    total: number;
  }> {
    try {
      const tables = await this.getAllTables();
      const stats = {
        available: tables.filter(t => t.status === 'AVAILABLE').length,
        occupied: tables.filter(t => t.status === 'OCCUPIED').length,
        reserved: tables.filter(t => t.status === 'RESERVED').length,
        total: tables.length,
      };

      return stats;
    } catch (error) {
      this.logger.error('Error getting tables stats:', error);
      throw error;
    }
  }

}
