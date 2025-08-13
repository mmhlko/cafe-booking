export type TTableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export class TableDto {
  id: number;
  name: string;
  capacity: number;
  status: TTableStatus;
  visitorData?: VisitorPayload
}

export class VisitorPayload {
  customerName?: string;
  phone?: string;
  guests: number;
  time?: string;
  message?: string
  visitorId: string;
}

export class UpdateTableStatusPayload {
  status: TTableStatus;
}

export class QuickSeatPayload {
  guests: number;
}