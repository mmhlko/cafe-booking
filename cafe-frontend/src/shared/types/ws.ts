import { ITable } from "@/widgets/tables";

export enum EWsMessageType {
  TABLE_UPDATE = 'table.update',
}

export type TWsEvent =
  | { type: EWsMessageType.TABLE_UPDATE; data: ITable }
