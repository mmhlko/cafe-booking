import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { ReservationPayload, TableDto, UpdateTableStatusPayload, TTableStatus} from './dto/table.dto';
import { ApiService } from './api.service';

@Controller('table')
export class ApiController {
  constructor(private readonly tablesService: ApiService) {}

  @Get()
  async getAllTables() {
    try {
      return this.tablesService.getAllTables();
    } catch (error) {
      return [];
    }
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateTableStatus(
    @Param('id') id: string,
    @Body() body: UpdateTableStatusPayload,
  ) {
    try {
      const tableId = parseInt(id, 10);
      if (isNaN(tableId)) throw new BadRequestException('Invalid table ID');
      return this.tablesService.updateTable(
        tableId,
        body.status,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post(':id/reserve')
  @HttpCode(HttpStatus.OK)
  async createReservation(
    @Param('id') id: string,
    @Body() reservationPayload: ReservationPayload,
  ) {
    try {
      const tableId = parseInt(id, 10);
      if (isNaN(tableId)) throw new BadRequestException('Invalid table ID');
      const table = await this.tablesService.createReservation(
        tableId,
        reservationPayload,
      );
      return table;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelReservation(@Param('id') id: string) {
    try {
      const tableId = parseInt(id);
      if (isNaN(tableId)) throw new BadRequestException('Invalid table ID');
      return this.tablesService.freeTable(tableId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Быстрая посадка гостей
   */
  @Post(':id/quick-seat')
  @HttpCode(HttpStatus.OK)
  async quickSeatTable(@Param('id') id: string) {
    try {
      const tableId = parseInt(id, 10);
      if (isNaN(tableId)) throw new BadRequestException('Invalid table ID');
      return this.tablesService.quickSeatTable(tableId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post(':id/free')
  @HttpCode(HttpStatus.OK)
  async freeTable(@Param('id') id: string) {
    try {
      const tableId = parseInt(id, 10);
      if (isNaN(tableId)) throw new BadRequestException('Invalid table ID');
      return this.tablesService.quickSeatTable(tableId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('stats/overview')
  async getTablesStats() {
    try {
      const stats = await this.tablesService.getTablesStats();
      return {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
