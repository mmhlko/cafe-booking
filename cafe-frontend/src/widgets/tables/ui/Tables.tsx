// /pages/index.tsx
import { useState } from "react";
import { ITable } from "../types";
import { TableGrid } from "./TableGrid";
import { TableModal } from "./TableModal";
import { useTables } from "@/app/_contexts/TableContext";

export function Tables() {
  const { tables, updateTableStatus} = useTables();
  const [selectedTable, setSelectedTable] = useState<ITable | null>(null);

  const handleTableClick = (table: ITable) => {
    setSelectedTable(table);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Restaurant Floor Plan</h1>
      <TableGrid tables={tables} onTableClick={handleTableClick} />
      {selectedTable && <TableModal table={selectedTable} onClose={() => setSelectedTable(null)} />}
    </div>
  );
}
