export type TTableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export interface ITable {
  id: number;
  name: string;
  capacity: number;
  status: TTableStatus;
  reservation?: IReservationPayload
}

export interface IReservationPayload {
  customerName: string;
  phone: string;
  guests?: number;
  time: string;
  message: string
}