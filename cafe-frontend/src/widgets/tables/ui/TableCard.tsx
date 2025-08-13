// /components/TableCard.tsx
import React from "react";
import { ITable } from "../types";

interface Props {
  table: ITable | null;
  onClick: (table: ITable) => void;
}

export const TableCard: React.FC<Props> = ({ table, onClick }) => {
  const statusColors = {
    AVAILABLE: "bg-green-500",
    OCCUPIED: "bg-red-500",
    RESERVED: "bg-yellow-500",
  };

  if (!table) {
    return null;
  }

  return (
    <div
      onClick={() => onClick(table)}
      className={`cursor-pointer rounded-lg p-4 shadow-md text-white flex flex-col items-center justify-center ${statusColors[table.status]} hover:opacity-80`}
    >
      <div className="text-lg font-bold">{table.name}</div>
      <div className="text-sm">{table.capacity} seats</div>
    </div>
  );
};
