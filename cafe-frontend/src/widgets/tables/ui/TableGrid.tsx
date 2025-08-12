// /components/TableGrid.tsx
import React from "react";
import { TableCard } from "./TableCard";
import { ITable } from "../types";

interface Props {
  tables: ITable[];
  onTableClick: (table: ITable) => void;
}

export const TableGrid: React.FC<Props> = ({ tables, onTableClick }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {tables.map((t) => (
        <TableCard key={t.id} table={t} onClick={onTableClick} />
      ))}
    </div>
  );
};
