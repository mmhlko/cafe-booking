export type TTableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export class TableDto {
  id: number;
  name: string;
  capacity: number;
  status: TTableStatus;
  reservation?: ReservationPayload
}

export class ReservationPayload {
  customerName: string;
  phone: string;
  guests?: number;
  time: string;
  message: string
}

export class UpdateTableStatusPayload {
  status: TTableStatus;
}