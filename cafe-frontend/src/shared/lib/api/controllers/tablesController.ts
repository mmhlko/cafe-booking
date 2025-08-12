import { tablesService, ITablesState, ITablesStats } from "../services/tablesService";
import { ICreateReservationData } from "../modules/tablesApi";
import { ITable, TTableStatus } from "@/widgets/tables/types";

export interface ITablesController {
  // Основные операции
  getAllTables(forceRefresh?: boolean): Promise<ITable[]>;
  getTableById(tableId: number): Promise<ITable | null>;
  updateTableStatus(tableId: number, status: TTableStatus): Promise<ITable | null>;
  
  // Операции с бронированием
  createReservation(tableId: number, reservationData: ICreateReservationData): Promise<ITable | null>;
  cancelReservation(tableId: number): Promise<ITable | null>;
  
  // Быстрые операции
  quickSeatTable(tableId: number): Promise<ITable | null>;
  freeTable(tableId: number): Promise<ITable | null>;
  
  // Статистика и аналитика
  getTablesStats(): Promise<ITablesStats | null>;
  getAvailableTables(): ITable[];
  getOccupiedTables(): ITable[];
  getReservedTables(): ITable[];
  
  // Управление состоянием
  subscribe(callback: (state: ITablesState) => void): () => void;
  getState(): ITablesState;
  clearCache(): void;
  
  // Валидация
  validateTableId(tableId: number): boolean;
  validateReservationData(data: ICreateReservationData): { isValid: boolean; errors: string[] };
}

export class TablesController implements ITablesController {
  /**
   * Получить все столы
   */
  public async getAllTables(forceRefresh = false): Promise<ITable[]> {
    try {
      return await tablesService.getAllTables(forceRefresh);
    } catch (error) {
      console.error('TablesController: Error getting all tables:', error);
      throw error;
    }
  }

  /**
   * Получить стол по ID
   */
  public async getTableById(tableId: number): Promise<ITable | null> {
    if (!this.validateTableId(tableId)) {
      throw new Error('Invalid table ID');
    }

    try {
      return await tablesService.getTableById(tableId);
    } catch (error) {
      console.error(`TablesController: Error getting table ${tableId}:`, error);
      throw error;
    }
  }

  /**
   * Обновить статус стола
   */
  public async updateTableStatus(tableId: number, status: TTableStatus): Promise<ITable | null> {
    if (!this.validateTableId(tableId)) {
      throw new Error('Invalid table ID');
    }

    try {
      return await tablesService.updateTableStatus(tableId, status);
    } catch (error) {
      console.error(`TablesController: Error updating table ${tableId} status:`, error);
      throw error;
    }
  }

  /**
   * Создать бронь
   */
  public async createReservation(tableId: number, reservationData: ICreateReservationData): Promise<ITable | null> {
    if (!this.validateTableId(tableId)) {
      throw new Error('Invalid table ID');
    }

    const validation = this.validateReservationData(reservationData);
    if (!validation.isValid) {
      throw new Error(`Invalid reservation data: ${validation.errors.join(', ')}`);
    }

    try {
      return await tablesService.createReservation(tableId, reservationData);
    } catch (error) {
      console.error(`TablesController: Error creating reservation for table ${tableId}:`, error);
      throw error;
    }
  }

  /**
   * Отменить бронь
   */
  public async cancelReservation(tableId: number): Promise<ITable | null> {
    if (!this.validateTableId(tableId)) {
      throw new Error('Invalid table ID');
    }

    try {
      return await tablesService.cancelReservation(tableId);
    } catch (error) {
      console.error(`TablesController: Error canceling reservation for table ${tableId}:`, error);
      throw error;
    }
  }

  /**
   * Быстрая посадка гостей
   */
  public async quickSeatTable(tableId: number): Promise<ITable | null> {
    if (!this.validateTableId(tableId)) {
      throw new Error('Invalid table ID');
    }

    try {
      return await tablesService.quickSeatTable(tableId);
    } catch (error) {
      console.error(`TablesController: Error quick seating table ${tableId}:`, error);
      throw error;
    }
  }

  /**
   * Освободить стол
   */
  public async freeTable(tableId: number): Promise<ITable | null> {
    if (!this.validateTableId(tableId)) {
      throw new Error('Invalid table ID');
    }

    try {
      return await tablesService.freeTable(tableId);
    } catch (error) {
      console.error(`TablesController: Error freeing table ${tableId}:`, error);
      throw error;
    }
  }

  /**
   * Получить статистику по столам
   */
  public async getTablesStats(): Promise<ITablesStats | null> {
    try {
      return await tablesService.getTablesStats();
    } catch (error) {
      console.error('TablesController: Error getting tables stats:', error);
      throw error;
    }
  }

  /**
   * Получить доступные столы
   */
  public getAvailableTables(): ITable[] {
    return tablesService.getAvailableTables();
  }

  /**
   * Получить занятые столы
   */
  public getOccupiedTables(): ITable[] {
    return tablesService.getOccupiedTables();
  }

  /**
   * Получить забронированные столы
   */
  public getReservedTables(): ITable[] {
    return tablesService.getReservedTables();
  }

  /**
   * Подписка на изменения состояния
   */
  public subscribe(callback: (state: ITablesState) => void): () => void {
    return tablesService.subscribe(callback);
  }

  /**
   * Получить текущее состояние
   */
  public getState(): ITablesState {
    return tablesService.getState();
  }

  /**
   * Очистить кеш
   */
  public clearCache(): void {
    tablesService.clearCache();
  }

  /**
   * Валидация ID стола
   */
  public validateTableId(tableId: number): boolean {
    return Number.isInteger(tableId) && tableId > 0;
  }

  /**
   * Валидация данных бронирования
   */
  public validateReservationData(data: ICreateReservationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.customerName || data.customerName.trim().length < 2) {
      errors.push('Customer name must be at least 2 characters long');
    }

    if (!data.phone || !/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone)) {
      errors.push('Invalid phone number format');
    }

    if (data.guests !== undefined && (data.guests < 1 || data.guests > 20)) {
      errors.push('Number of guests must be between 1 and 20');
    }

    if (!data.time || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(data.time)) {
      errors.push('Invalid time format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Получить столы по вместимости
   */
  public getTablesByCapacity(minCapacity: number, maxCapacity?: number): ITable[] {
    const state = this.getState();
    return state.tables.filter(table => {
      if (maxCapacity) {
        return table.capacity >= minCapacity && table.capacity <= maxCapacity;
      }
      return table.capacity >= minCapacity;
    });
  }

  /**
   * Получить столы по статусу и вместимости
   */
  public getTablesByStatusAndCapacity(status: TTableStatus, minCapacity: number, maxCapacity?: number): ITable[] {
    const tablesByStatus = this.getTablesByStatus(status);
    return tablesByStatus.filter(table => {
      if (maxCapacity) {
        return table.capacity >= minCapacity && table.capacity <= maxCapacity;
      }
      return table.capacity >= minCapacity;
    });
  }

  /**
   * Получить столы по статусу (приватный метод для внутреннего использования)
   */
  private getTablesByStatus(status: TTableStatus): ITable[] {
    const state = this.getState();
    return state.tables.filter(table => table.status === status);
  }
}

// Экспорт экземпляра для использования в приложении
export const tablesController = new TablesController();
