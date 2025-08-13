import { ApiBase } from "@/shared/lib/api/apiBase";
import { apiRoutes } from "@/shared/lib/api/apiRoutes";
import { IReservationPayload, ITable } from "../types";

interface TableApiResponse<Data> {
  success: boolean;
  data: Data;
  timestamp: string;
  error?: undefined;
}

export class TablesApi extends ApiBase {
  constructor() {
    super();
    this.api.defaults.withCredentials = true;
  }

  /**
   * Get all tables
   */
  public getTables = async () => {
    try {
      const { data } = await this.api.get<ITable[]>(apiRoutes.table.baseRoute);
      return data.length ? data : [];
    } catch (error: unknown) {
      this.handleError(error, 'Get Tables');
      return [];
    }
  };

  /**
   * Get table by ID
   */
  public getTableById = async (tableId: number) => {
    try {
      const { data } = await this.api.get<ITable>(`${apiRoutes.table.baseRoute}/${tableId}`);
      return data;
    } catch (error: unknown) {
      this.handleError(error, `Get Table #${tableId}`);
      return null;
    }
  };

  /**
   * Update table status
   */
  public updateTableStatus = async (tableId: number, status: ITable["status"], guests?: number) => {
    try {
      const { data } = await this.api.patch<ITable>(
        `${apiRoutes.table.baseRoute}/${tableId}/status`,
        { status, guests }
      );
      return data;
    } catch (error: unknown) {
      this.handleError(error, `Update Table Status #${tableId}`);
      return null;
    }
  };

  /**
   * Create reservation
   */
  public createReservation = async (
    tableId: number,
    reservationData: { customerName: string; phone: string; guests?: number; time: string }
  ) => {
    try {
      const { data } = await this.api.post<ITable>(
        `${apiRoutes.table.baseRoute}/${tableId}/reserve`,
        reservationData
      );
      return data;
    } catch (error: unknown) {
      this.handleError(error, `Create Reservation #${tableId}`);
      return null;
    }
  };

  /**
   * Cancel reservation
   */
  public cancelReservation = async (tableId: number) => {
    try {
      const { data } = await this.api.post<ITable>(
        `${apiRoutes.table.baseRoute}/${tableId}/cancel`
      );
      return data;
    } catch (error: unknown) {
      this.handleError(error, `Cancel Reservation #${tableId}`);
      return null;
    }
  };

  /**
   * Quick seat guests
   */
  public quickSeatTable = async (tableId: number, guests: number) => {
    try {
      const { data } = await this.api.post<ITable>(
        `${apiRoutes.table.baseRoute}/${tableId}/quick-seat`,
        { guests }
      )
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Free table
   */
  public freeTable = async (tableId: number) => {
    try {
      const { data } = await this.api.post<ITable>(
        `${apiRoutes.table.baseRoute}/${tableId}/free`
      )
      return data;
    } catch (error) {
      throw error;
    }
  };
}

export const tablesApi = new TablesApi();
