export type TTableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export interface ITable {
  id: number;
  name: string;
  capacity: number;
  status: TTableStatus;
  reservation?: ReservationPayload
}

export interface ReservationPayload {
  customerName: string;
  phone: string;
  guests?: number;
  time: string;
  message: string
}