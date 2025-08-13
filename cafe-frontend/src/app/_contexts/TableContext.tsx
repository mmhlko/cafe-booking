'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ITable } from '@/widgets/tables/types';
import { tablesApi } from '@/widgets/tables/api/tablesApi';

interface TableContextType {
  tables: ITable[];
  loading: boolean;
  error: string | null;
  fetchTables: () => Promise<void>;
  updateTableStatus: (tableId: number, status: ITable["status"]) => Promise<void>;
  createReservation: (tableId: number, reservationData: { customerName: string; phone: string; guests?: number; time: string }) => Promise<ITable | null>;
  cancelReservation: (tableId: number) => Promise<void>;
  quickSeatTable: (tableId: number, guests: number) => Promise<void>;
  freeTable: (tableId: number) => Promise<void>;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<ITable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const tables = await tablesApi.getTables();
      setTables(tables);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching tables:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTableStatus = async (tableId: number, status: ITable["status"]) => {
    try {
      const updatedTable = await tablesApi.updateTableStatus(tableId, status);
      if (updatedTable) {
        setTables(prevTables =>
          prevTables.map(t => t.id === tableId ? updatedTable : t)
        );
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error updating table status:', err);
      throw err;
    } finally {
      // Don't set loading to false here as it's a quick operation
    }
  };

  const createReservation = async (tableId: number, reservationData: { customerName: string; phone: string; guests?: number; time: string }): Promise<ITable | null> => {
    try {
      const updatedTable = await tablesApi.createReservation(tableId, reservationData);
      if (updatedTable) {
        setTables(prevTables =>
          prevTables.map(t => t.id === tableId ? updatedTable : t)
        );
        return updatedTable;
      }
      setError(null);
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error creating reservation:', err);
      throw err;
    } finally {
      // Don't set loading to false here as it's a quick operation
    }
  };

  const cancelReservation = async (tableId: number) => {
    try {
      const updatedTable = await tablesApi.cancelReservation(tableId);
      if (updatedTable) {
        setTables(prevTables =>
          prevTables.map(t => t.id === tableId ? updatedTable : t)
        );
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error canceling reservation:', err);
      throw err;
    } finally {
      // Don't set loading to false here as it's a quick operation
    }
  };

  const quickSeatTable = async (tableId: number, guests: number) => {
    try {
      const updatedTable = await tablesApi.quickSeatTable(tableId, guests);
      if (updatedTable) {
        setTables(prevTables =>
          prevTables.map(t => t.id === tableId ? updatedTable : t)
        );
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error seating table:', err);
      throw err;
    } finally {
      // Don't set loading to false here as it's a quick operation
    }
  };

  const freeTable = async (tableId: number) => {
    try {
      const updatedTable = await tablesApi.freeTable(tableId);
      if (updatedTable) {
        setTables(prevTables =>
          prevTables.map(t => t.id === tableId ? updatedTable : t)
        );
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error freeing table:', err);
      throw err;
    } finally {
      // Don't set loading to false here as it's a quick operation
    }
  };

  const value = {
    tables,
    loading,
    error,
    fetchTables,
    updateTableStatus,
    createReservation,
    cancelReservation,
    quickSeatTable,
    freeTable
  };

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTables() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTables must be used within a TableProvider');
  }
  return context;
}