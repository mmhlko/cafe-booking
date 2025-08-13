import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';

import {
  UpdateTableStatusPayload,
  QuickSeatPayload,
  VisitorPayload,
} from './dto/table.dto';
import { TablesService } from './tables.service';

@Controller('table')
export class TablesiController {
  private readonly logger = new Logger(TablesiController.name);

  constructor(private readonly tablesService: TablesService) {}

  @Get()
  async getAllTables() {
    try {
      return this.tablesService.getAllTables();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
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
      return this.tablesService.updateTable(tableId, body.status);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post(':id/reserve')
  @HttpCode(HttpStatus.OK)
  async createReservation(
    @Param('id') id: string,
    @Body() reservationPayload: VisitorPayload,
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

  /**
   * Быстрая посадка гостей
   */
  @Post(':id/quick-seat')
  @HttpCode(HttpStatus.OK)
  async quickSeatTable(
    @Param('id') id: string,
    @Body() quickSeatPayload: QuickSeatPayload,
  ) {
    try {
      const tableId = parseInt(id, 10);
      if (isNaN(tableId)) throw new BadRequestException('Invalid table ID');
      return this.tablesService.quickSeatTable(
        tableId,
        quickSeatPayload.guests,
      );
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
      return this.tablesService.freeTable(tableId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
